import React, { useState, useRef, useEffect, useMemo, memo, useCallback } from "react";
import { createPortal } from 'react-dom';
import defaultIgnoredFiles from './ignoreList.js';
import ignoredFolderNames from './ignoreFolders.js';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// --- СПИСКИ РАСШИРЕНИЙ И КОНСТАНТЫ (ВЕРХНИЙ УРОВЕНЬ) ---

const icons = {
  file: <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  folder: <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
  folderOpen: <svg className="w-5 h-5" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 0A2.25 2.25 0 015.25 7.5h13.5a2.25 2.25 0 012.25 2.25m-16.5 0v6.75a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V9.75" /></svg>,
  info: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>,
};
const imageExtensions = new Set(['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tif', 'tiff', 'jfif', 'jp2', 'jpx', 'j2k', 'jxr', 'jls', 'wdp', 'hdp', 'xbm', 'xpm', 'avif', 'heic', 'heif', 'heics', 'jxl', 'dng', 'cr2', 'cr3', 'crw', 'nef', 'nrw', 'arw', 'srf', 'sr2', 'orf', 'raf', 'pef', 'rw2', 'raw', 'rwl', 'srw', '3fr', 'kdc', 'mos', 'mrw', 'erf', 'bay', 'k25', 'dcs', 'ptx', 'ai', 'eps', 'cdr', 'wmf', 'emf', 'fig', 'dxf', 'cgm', 'sk', 'skp', 'fits', 'dcm', 'dicom', 'tga', 'pcx', 'ppm', 'pgm', 'pbm', 'pnm', 'psd', 'psb', 'xcf', 'dpx', 'cin', 'exr', 'fax', 'icns', 'pict', 'pct', 'apng', 'mng', 'fli', 'flc']);
const hardIgnoredExtensions = new Set(['exe', 'msi', 'sys', 'bat', 'cmd', 'sh', 'com', 'pif', 'scr', 'app', 'pkg', 'dmg', 'cpl', 'gadget', 'jar', 'action', 'wsf', 'vbs', 'dll', 'so', 'dylib', 'o', 'obj', 'a', 'lib', 'sys', 'drv', 'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'tgz', 'iso', 'img', 'cab', 'arj', 'lha', 'ace', 'lbr', 'lqr', 'war', 'vhd', 'vmdk', 'vdi', 'vbox', 'vmx', 'pvs', 'hdd', 'nrg', 'ds_store', 'thumbs.db', 'desktop.ini', 'ntuser.dat', 'icon', 'ini', 'inf', 'reg', 'plist', 'sqlite', 'sqlite3', 'db', 'mdb', 'accdb', 'sdf', 'dbf', 'dat', 'frm', 'myd', 'myi', 'nsf', 'mp4', 'm4v', 'mov', 'avi', 'mkv', 'webm', 'wmv', 'flv', 'mpg', 'mpeg', 'asf', 'vob', '3gp', 'mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'aiff', 'wma', 'mid', 'midi', 'm3u', 'pls', 'asx', 'bup', 'ifo', 'ttf', 'otf', 'woff', 'woff2', 'eot', 'tmp', 'temp', 'bak', 'old', '$$$', '.~', 'part', 'parts', 'crdownload', 'download', 'swp', 'swo', 'bkp', 'bk!', 'torrent', 'pak', 'wad', 'vpk', 'sav', 'bsp', 'nes', 'sfc', 'gb', 'gba', 'nds', 'rom', 'pdb', 'ilk', 'map', 'ncb', 'suo', 'pch', 'idb', 'gch', 'objdump', 'key', 'pem', 'cer', 'crt', 'pfx', 'p12', 'p7s', 'p7b', 'eml', 'msg', 'mbox', 'shp', 'shx', 'bin', 'cue', 'nfo', 'lock', 'pid', 'chk', 'cda']);
const documentExtensions = new Set(['pdf', 'doc', 'docx', 'docm', 'dot', 'dotx', 'ppt', 'pptx', 'pps', 'ppsx', 'xls', 'xlsx', 'xlsm', 'xlt', 'xltx', 'pub', 'vsd', 'vsdx', 'odt', 'odp', 'ods', 'odg', 'odf', 'ott', 'otp', 'ots', 'pages', 'key', 'numbers', 'tex', 'epub', 'mobi', 'azw', 'azw3', 'lit', 'rtf', 'xps', 'mht', 'mhtml', 'mpp']);


const AboutModal = ({ onClose }) => {
  return createPortal(
    // Overlay (полупрозрачный фон)
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      {/* Контейнер окна */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full text-gray-900 dark:text-gray-200">
        <h2 className="text-2xl font-bold mb-4">About Nexus Weaver</h2>
        <p className="mb-4 text-sm">
          Nexus Weaver helps you combine project files into one single text file. This is very useful for large AI models.
        </p>
        <p className="mb-4 text-sm">
          Drag and drop your project, select the files you need, and the app will create a single output for you. Images and documents are safely converted.
        </p>
        <p className="text-sm">
          For any questions, please contact me at:<br/>
          <a href="mailto:matthewzhv@outlook.com" className="text-blue-500 hover:underline">
            matthewzhv@outlook.com
          </a>
        </p>
        <button
          onClick={onClose}
          className="mt-6 w-full font-semibold py-2 px-4 rounded-lg transition-colors bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (ВЕРХНИЙ УРОВЕНЬ) ---

async function scanDirectory(directoryEntry) {
  const reader = directoryEntry.createReader();
  let allEntries = [];

  const readEntries = () => {
    return new Promise((resolve, reject) => {
      reader.readEntries(async (entries) => {
        if (entries.length === 0) {
          resolve(allEntries);
        } else {
          allEntries = allEntries.concat(entries);
          resolve(await readEntries());
        }
      }, reject);
    });
  };

  const entries = await readEntries();
  const files = await Promise.all(
    entries.map(entry =>
      entry.isFile
        ? new Promise(resolve => entry.file(file => resolve(file)))
        : scanDirectory(entry)
    )
  );

  return files.flat();
}

async function getDroppedFiles(dataTransferItems) {
  const promises = Array.from(dataTransferItems)
    .map(item => {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        return entry.isFile
          ? new Promise(resolve => entry.file(file => resolve(file)))
          : scanDirectory(entry);
      }
      return null;
    })
    .filter(Boolean);

  const nestedFiles = await Promise.all(promises);
  return nestedFiles.flat();
}

const buildFileTree = (files) => {
  const root = { name: 'root', type: 'folder', children: [] };
  const map = { 'root': root };
  for (const file of files) {
    const path = file.webkitRelativePath || file.name;
    const parts = path.split('/');
    let parent = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isFolder = i < parts.length - 1;
      const currentPath = parts.slice(0, i + 1).join('/');
      if (!map[currentPath]) {
        const newItem = { name: part, type: isFolder ? 'folder' : 'file', path: currentPath, children: isFolder ? [] : undefined, file };
        map[currentPath] = newItem;
        parent.children.push(newItem);
      }
      if (isFolder) parent = map[currentPath];
    }
  }
  return root.children;
};

const getDescendantFilePaths = (item) => {
  if (item.type === 'file') return [item.path];
  let paths = [];
  if (item.children) {
    for (const child of item.children) {
      paths.push(...getDescendantFilePaths(child));
    }
  }
  return paths;
};

const Tooltip = ({ content, x, y }) => {
  return createPortal(
    <div className="fixed bg-gray-800 text-white text-xs rounded py-1 px-2 z-50 pointer-events-none transform -translate-x-1/2" style={{ top: y, left: x }}>
      {content}
    </div>,
    document.getElementById('tooltip-root')
  );
};

const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

// --- КОМПОНЕНТЫ ДЛЯ ВИРТУАЛЬНОГО СПИСКА (ВЕРХНИЙ УРОВЕНЬ) ---

const ResultRow = memo(({ index, style, data }) => (
    <div style={style} className="whitespace-pre font-mono text-sm leading-6">
        {data[index]}
    </div>
));

const FileTreeRow = memo(({ index, style, data }) => {
    const { items, getSelectionState, handleToggleSelection, handleToggleFolder, openFolders, showTooltip, hideTooltip } = data;
    const item = items[index];
    if (!item) return null;

    const isFolder = item.type === 'folder';
    const selectionState = getSelectionState(item);
    
    const extension = item.type === 'file' ? item.path.split('.').pop().toLowerCase() : '';
    const isImage = imageExtensions.has(extension);
    const isDocument = documentExtensions.has(extension);

    return (
      <div style={style} className="flex items-center text-sm hover:bg-gray-500/10 pr-2">
        <span style={{ width: `${item.depth * 24}px` }} className="flex-shrink-0" />
        <div className="flex items-center space-x-2 truncate py-1">
          <input 
            type="checkbox" 
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
            checked={selectionState === 'checked'}
            ref={el => el && (el.indeterminate = selectionState === 'indeterminate')}
            onChange={() => handleToggleSelection(item)}
            disabled={item.isIgnored}
          />
          <div 
            className={`file-icon ${isFolder ? 'cursor-pointer' : ''} ${item.isIgnored ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}`} 
            onClick={() => isFolder && handleToggleFolder(item.path)}
          >
            {isFolder ? (openFolders.has(item.path) ? icons.folderOpen : icons.folder) : icons.file}
          </div>
          <span 
            className={`file-name truncate ${isFolder ? 'cursor-pointer' : ''} ${item.isIgnored ? 'text-gray-500' : ''}`} 
            onClick={() => isFolder && handleToggleFolder(item.path)} 
            title={item.name}
          >
            {item.name}
          </span>
          <div className="flex items-center space-x-1">
            {item.isIgnored && (
              <div onMouseEnter={(e) => showTooltip("This file is ignored by default as it appears to be a system, configuration, or generated file, not primary source code.", e)} onMouseLeave={hideTooltip}>
                <div className="text-gray-400">{icons.info}</div>
              </div>
            )}
            {isImage && !item.isIgnored && (
              <div onMouseEnter={(e) => showTooltip("Encoded as Base64. Warning: increases file size and can be slow for AI.", e)} onMouseLeave={hideTooltip}>
                <div className="text-blue-400">{icons.info}</div>
              </div>
            )}
            {isDocument && !item.isIgnored && (
              <div onMouseEnter={(e) => showTooltip("Encoded as Base64. Warning: increases file size and can be slow for AI.", e)} onMouseLeave={hideTooltip}>
                <div className="text-green-500">{icons.info}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
});

// --- ОСНОВНОЙ КОМПОНЕНТ ПРИЛОЖЕНИЯ ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState("upload");
  const [fileTree, setFileTree] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [selectedPaths, setSelectedPaths] = useState(new Set());
  const [openFolders, setOpenFolders] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentProcessingFile, setCurrentProcessingFile] = useState("");
  const [resultLines, setResultLines] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const openAboutModal = useCallback(() => setIsAboutModalOpen(true), []);
  const closeAboutModal = useCallback(() => setIsAboutModalOpen(false), []);
  
  const folderInputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const isFileIgnored = useCallback((item) => {
    if (defaultIgnoredFiles.has(item.name)) return true;
    const extension = `.${item.name.split('.').pop()}`;
    if (defaultIgnoredFiles.has(extension)) return true;

    if (item.path) {
      const pathParts = item.path.split('/');
      const loopLimit = item.type === 'folder' ? pathParts.length : pathParts.length - 1;
      for (let i = 0; i < loopLimit; i++) {
        if (ignoredFolderNames.has(pathParts[i])) return true;
      }
    }
    return false;
  }, []);

  const processFiles = useCallback((files) => {
    if (!files || files.length === 0) {
      console.log("No processable files found.");
      return;
    }

    let rootName = "Selected Items";
    if (files[0].webkitRelativePath) {
        rootName = files[0].webkitRelativePath.split('/')[0];
    } else if (files.length === 1) {
        rootName = files[0].name;
    }

    const newFileTree = buildFileTree(files);
    
    const initialSelection = new Set();
    const initialOpenFolders = new Set();

    function traverse(items) {
      for (const item of items) {
        item.isIgnored = isFileIgnored(item);
        
        if (item.type === 'file' && !item.isIgnored) {
          const fileExtension = item.path.split('.').pop().toLowerCase();
          if (!imageExtensions.has(fileExtension) && !documentExtensions.has(fileExtension)) {
            initialSelection.add(item.path);
          }
        } else if (item.type === 'folder') {
          const descendantPaths = getDescendantFilePaths(item);
          const hasSelectableFiles = descendantPaths.some(path => !isFileIgnored({ type: 'file', path, name: path.split('/').pop() }));
          if (hasSelectableFiles) {
            initialOpenFolders.add(item.path);
          }
          if (item.children) {
            traverse(item.children);
          }
        }
      }
    }
    traverse(newFileTree);

    setFolderName(rootName);
    setFileTree(newFileTree);
    setSelectedPaths(initialSelection);
    setOpenFolders(initialOpenFolders);
    setCurrentScreen("processing");
  }, [isFileIgnored]);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.items) {
        const files = await getDroppedFiles(e.dataTransfer.items);
        processFiles(files);
    }
  }, [processFiles]);

  const handleInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  }, [processFiles]);

  const handleToggleFolder = useCallback((folderPath) => {
    setOpenFolders(prev => {
      const newOpen = new Set(prev);
      if (newOpen.has(folderPath)) newOpen.delete(folderPath);
      else newOpen.add(folderPath);
      return newOpen;
    });
  }, []);

  const handleToggleSelection = useCallback((item) => {
    const pathsToToggle = getDescendantFilePaths(item);
    const selectablePathsToToggle = pathsToToggle.filter(path => !isFileIgnored({ path, name: path.split('/').pop(), type: 'file' }));
    
    const newSelectedPaths = new Set(selectedPaths);
    const areAllSelected = selectablePathsToToggle.length > 0 && selectablePathsToToggle.every(path => newSelectedPaths.has(path));
    
    if (areAllSelected) {
      selectablePathsToToggle.forEach(path => newSelectedPaths.delete(path));
    } else {
      selectablePathsToToggle.forEach(path => newSelectedPaths.add(path));
    }
    setSelectedPaths(newSelectedPaths);
  }, [selectedPaths, isFileIgnored]);
  
  const getSelectionState = useCallback((item) => {
    const descendantPaths = getDescendantFilePaths(item);
    const selectablePaths = descendantPaths.filter(path => !isFileIgnored({ path, name: path.split('/').pop(), type: 'file' }));
    if (selectablePaths.length === 0) return 'unchecked';
    const selectedCount = selectablePaths.filter(path => selectedPaths.has(path)).length;
    if (selectedCount === 0) return 'unchecked';
    if (selectedCount === selectablePaths.length) return 'checked';
    return 'indeterminate';
  }, [selectedPaths, isFileIgnored]);
  
  const handleSelectAll = useCallback(() => {
    const allSelectablePaths = fileTree
        .flatMap(item => getDescendantFilePaths(item))
        .filter(path => !isFileIgnored({path, name: path.split('/').pop(), type: 'file'}));
    setSelectedPaths(new Set(allSelectablePaths));
  }, [fileTree, isFileIgnored]);
  
  const handleDeselectAll = useCallback(() => setSelectedPaths(new Set()), []);
  
  const handleHardRefresh = useCallback(() => {
    window.location.reload(true);
  }, []);
  
  const startProcessing = useCallback(async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const allFiles = new Map();
    const collectFiles = (items) => {
      for (const item of items) {
        if (item.type === 'file') allFiles.set(item.path, item.file);
        if (item.children) collectFiles(item.children);
      }
    }
    collectFiles(fileTree);

    const filesToProcess = Array.from(selectedPaths).sort();
    const totalFiles = filesToProcess.length;

    let mergedContent = `# The following text is a representation of a project's directory structure and file contents.\n# Parsing Rules:\n# 1. File Separator: A line containing only '----'.\n# 2. File Path: The line immediately following the separator, indicating the file's full relative path.\n# 3. File Content: The text block following the path line.\n# 4. Terminator: The text stream concludes with a line containing only '--END--'.\n\n`;

    for (let i = 0; i < totalFiles; i++) {
      const path = filesToProcess[i];
      const file = allFiles.get(path);
      setCurrentProcessingFile(path);

      if (file) {
        try {
          const fileExtension = path.split('.').pop().toLowerCase();
          let content;

          if (imageExtensions.has(fileExtension)) {
            const dataUrl = await readFileAsDataURL(file);
            content = `[IMAGE_DATA: ${dataUrl}]`;
          } else if (documentExtensions.has(fileExtension)) {
            const dataUrl = await readFileAsDataURL(file);
            content = `[DOCUMENT_DATA: ${dataUrl}]`;
          } else {
            content = await file.text();
          }

          mergedContent += `----\n${path}\n${content}\n`;
        } catch (error) {
          console.error(`Error processing file ${path}:`, error);
          mergedContent += `----\n${path}\n[Error: Could not read file content]\n`;
        }
      }
      setProcessingProgress(((i + 1) / totalFiles) * 100);
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    mergedContent += '--END--';
    setResultLines(mergedContent.split('\n'));
    setIsProcessing(false);
    setCurrentScreen("result");
  }, [fileTree, selectedPaths]);
  
  const copyToClipboard = useCallback(() => {
    if(resultLines.length > 0) navigator.clipboard.writeText(resultLines.join('\n'));
  }, [resultLines]);

  const downloadDocument = useCallback(() => {
    if(resultLines.length === 0) return;
    const blob = new Blob([resultLines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'nexus-weaver-output.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }, [resultLines]);
  
  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);
  
  const showTooltip = useCallback((content, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ visible: true, content, x: rect.left + rect.width / 2, y: rect.bottom + window.scrollY + 8 });
  }, []);

  const hideTooltip = useCallback(() => setTooltip(prev => ({ ...prev, visible: false })), []);
  
  const flattenedTree = useMemo(() => {
    const flat = [];
    function flatten(items, depth) {
      items.sort((a,b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'folder' ? -1 : 1;
      }).forEach(item => {
        flat.push({ ...item, depth });
        if (item.type === 'folder' && openFolders.has(item.path)) {
          flatten(item.children || [], depth + 1);
        }
      });
    }
    flatten(fileTree, 0);
    return flat;
  }, [fileTree, openFolders]);

  const fileTreeData = useMemo(() => ({
    items: flattenedTree,
    getSelectionState,
    handleToggleSelection,
    handleToggleFolder,
    openFolders,
    showTooltip,
    hideTooltip
  }), [flattenedTree, getSelectionState, handleToggleSelection, handleToggleFolder, openFolders, showTooltip, hideTooltip]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      {isAboutModalOpen && <AboutModal onClose={closeAboutModal} />}
      {tooltip.visible && <Tooltip content={tooltip.content} x={tooltip.x} y={tooltip.y} />}

      <header className={`px-6 py-4 flex justify-between items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        <h1 onClick={handleHardRefresh} className="text-2xl font-bold tracking-tight cursor-pointer">
          Nexus Weaver
        </h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
            {darkMode ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg> : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
          </button>
          <button onClick={openAboutModal} className={`text-sm hover:underline ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            About
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        {currentScreen === "upload" && (
          <div className="flex flex-col items-center justify-center min-h-[75vh]">
            <div
              className={`w-full max-w-3xl border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-500/10' : (darkMode ? 'border-gray-600' : 'border-gray-300')}`}
              onDragEnter={() => setIsDragging(true)}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <svg className="w-16 h-16 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Drop your project folder or files here</h2>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-4`}>or</p>
              <div className="mt-6 flex justify-center items-center space-x-4">
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className={`font-semibold py-2 px-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Select Folder
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`font-semibold py-2 px-4 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}
                >
                  Select Files
                </button>
              </div>
              <input type="file" ref={folderInputRef} onChange={handleInputChange} multiple webkitdirectory="" directory="" className="hidden"/>
              <input type="file" ref={fileInputRef} onChange={handleInputChange} multiple className="hidden"/>
            </div>
          </div>
        )}

        {currentScreen === "processing" && (
          <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 h-[75vh]`}>
            <div className={`lg:col-span-2 rounded-2xl p-4 flex flex-col ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
              <div className={`flex items-center justify-between mb-2 pb-2 border-b flex-shrink-0 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <h2 className={`font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={folderName}>Project: {folderName}</h2>
                <div className="flex space-x-3 flex-shrink-0">
                  <button onClick={handleSelectAll} className={`text-xs font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>Select All</button>
                  <button onClick={handleDeselectAll} className={`text-xs font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>Deselect All</button>
                </div>
              </div>
              <div className="flex-grow min-h-0 w-full">
                <AutoSizer>
                  {({ height, width }) => (
                    <List 
                        height={height} 
                        itemCount={flattenedTree.length} 
                        itemSize={32} 
                        width={width} 
                        itemData={fileTreeData}
                    >
                      {FileTreeRow}
                    </List>
                  )}
                </AutoSizer>
              </div>
            </div>
            
            <div className={`lg:col-span-3 rounded-2xl p-6 flex flex-col justify-center items-center ${darkMode ? 'bg-gray-800/50' : 'bg-white/80'}`}>
              <div className="text-center w-full max-w-sm">
                <h2 className={`text-2xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Ready to Weave</h2>
                <p className="mb-6 text-gray-500">{selectedPaths.size} files selected</p>
                {isProcessing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm"><span className={`truncate pr-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} title={currentProcessingFile}>Processing: {currentProcessingFile}</span><span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{Math.round(processingProgress)}%</span></div>
                    <div className={`w-full h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}><div className="h-2 bg-blue-600 rounded-full" style={{ width: `${processingProgress}%` }} /></div>
                  </div>
                ) : (
                  <button onClick={startProcessing} disabled={isProcessing || selectedPaths.size === 0} className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-transform transform hover:scale-105 active:scale-95 ${isProcessing || selectedPaths.size === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg'}`}>{isProcessing ? 'Processing...' : `Weave ${selectedPaths.size} Files`}</button>
                )}
              </div>
            </div>
          </div>
        )}
        
        {currentScreen === "result" && (
          <div className="h-[75vh] flex flex-col rounded-2xl overflow-hidden">
            <div className={`p-3 border-b flex justify-end space-x-2 flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'}`}>
                <button onClick={() => setCurrentScreen('processing')} className={`px-3 py-1 text-sm font-medium rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>Back to Files</button>
                <button onClick={copyToClipboard} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700'} shadow`} title="Copy to clipboard"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg></button>
                <button onClick={downloadDocument} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-700'} shadow`} title="Download document"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></button>
            </div>
            <div className={`flex-grow min-h-0 w-full p-2 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <AutoSizer>
                  {({ height, width }) => (
                    <List
                      height={height}
                      itemCount={resultLines.length}
                      itemSize={24}
                      width={width}
                      itemData={resultLines}
                    >
                      {ResultRow}
                    </List>
                  )}
                </AutoSizer>
            </div>
          </div>
        )}
      </main>

      <footer className={`px-6 py-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Built with ❤️ by{' '}
        <a href="https://github.com/angryflaren" target="_blank" rel="noopener noreferrer" className="font-medium hover:underline text-blue-500">
            Matthew
        </a>
      </footer>
    </div>
  );
};

export default App;