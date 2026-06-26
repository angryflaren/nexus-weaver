// src/services/githubService.js

/**
 * Парсер GitHub URL.
 * Разбирает ссылку и делает запросы к API для точного определения ветки и пути.
 */
async function parseGithubUrl(url) {
    // 1. Очистка URL и защита от кривых ссылок
    let cleanUrl = url.trim().replace(/\/+$/, '');
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = 'https://' + cleanUrl;
    
    const urlObj = new URL(cleanUrl);
    if (!urlObj.hostname.includes('github.com')) {
        throw new Error("Not a valid GitHub URL");
    }

    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) {
        throw new Error("URL must contain owner and repository");
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, '');

    // Сценарий А: Корень репозитория
    if (parts.length === 2) {
        const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!repoRes.ok) throw new Error(`Repository not found: ${repoRes.status}`);
        const repoData = await repoRes.json();
        
        return { owner, repo, branch: repoData.default_branch, subPath: '' };
    }

    // Сценарий Б: Ссылка на конкретную ветку, папку или файл (/tree/ или /blob/)
    if (parts[2] === 'tree' || parts[2] === 'blob') {
        const pathParts = parts.slice(3);
        if (pathParts.length === 0) throw new Error("Branch name is missing in URL");

        let branch = pathParts[0]; // считаем веткой первое слово
        let subPathIndex = 1;

        try {
            // Запрашиваем список веток, чтобы найти точное совпадение
            const branchesRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`);
            
            if (branchesRes.ok) {
                const branches = await branchesRes.json();
                const branchNames = branches.map(b => b.name);
                
                for (let i = pathParts.length; i > 0; i--) {
                    const potentialBranch = pathParts.slice(0, i).join('/');
                    if (branchNames.includes(potentialBranch)) {
                        branch = potentialBranch;
                        subPathIndex = i;
                        break;
                    }
                }
            }
        } catch (e) {
            console.warn("Could not fetch branches for precise validation, falling back to basic parsing", e);
        }

        // Всё, что идет после подтвержденного имени ветки — это путь к папке/файлу
        const subPath = pathParts.slice(subPathIndex).join('/');
        return { owner, repo, branch, subPath };
    }

    throw new Error("Unsupported GitHub URL format");
}

export async function fetchGithubRepoAsFiles(githubUrl) {
    // 1. Делегируем парсинг умной функции
    const { owner, repo, branch, subPath } = await parseGithubUrl(githubUrl);

    // 2. Запрашиваем полное дерево файлов (рекурсивно)
    const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    if (!treeRes.ok) throw new Error(`Failed to fetch repo tree: ${treeRes.status}`);
    const treeData = await treeRes.json();

    // 3. Умная фильтрация ДО скачивания
    const ignoreFolders = ['node_modules', '.git', 'dist', 'build', 'vendor'];
    
    const filesToFetch = treeData.tree.filter(node => {
        if (node.type !== 'blob') return false; // Игнорируем папки (берем только конечные файлы)
        
        // Если ссылка на конкретную папку => отбрасываем все файлы, которые лежат за её пределами
        if (subPath && !node.path.startsWith(subPath + '/') && node.path !== subPath) {
            return false;
        }

        // Отбрасываем тяжелые системные папки
        const pathParts = node.path.split('/');
        if (ignoreFolders.some(folder => pathParts.includes(folder))) return false;
        
        return true;
    });

    if (filesToFetch.length === 0) {
        throw new Error("No valid files found at this path.");
    }

    const files = [];
    const concurrencyLimit = 15;

    // 4. Загружаем содержимое файлов батчами
    for (let i = 0; i < filesToFetch.length; i += concurrencyLimit) {
        const chunk = filesToFetch.slice(i, i + concurrencyLimit);
        
        const chunkPromises = chunk.map(async (node) => {
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${node.path}`;
            
            try {
                const res = await fetch(rawUrl);
                if (!res.ok) return null;
                
                const blob = await res.blob();
                const file = new File([blob], node.path.split('/').pop(), { type: blob.type });
                
                // Сохраняем полный путь для правильного отображения в дереве
                Object.defineProperty(file, 'webkitRelativePath', {
                    value: `${repo}/${node.path}`,
                    writable: false
                });
                
                return file;
            } catch (err) {
                console.error(`Failed to fetch ${node.path}`, err);
                return null;
            }
        });

        const results = await Promise.all(chunkPromises);
        files.push(...results.filter(Boolean));
    }

    return files;
}