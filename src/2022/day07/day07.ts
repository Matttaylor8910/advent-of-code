import {readFile} from '../../common/file';

enum FileType {
  DIR = 'dir',
  FILE = 'file',
}

interface File {
  name: string;
  path: string;
  size: number;
  type: FileType
  children: File[];
  parent?: File;
}

function getPath(file: File|undefined, dir: string) {
  if (dir === '/') return '/';
  return `${file?.path}${dir}/`;
}

/**
 * Add the child file to the list of children for this directory and update the
 * size of this directory as well as any parent directories
 *
 * @param parent
 * @param child
 */
function addChild(directory: File|undefined, child: File) {
  // directory should be defined in this case
  directory?.children.push(child);

  // increment this directory's size and all of its parents
  while (directory) {
    directory.size += child.size;
    directory = directory.parent;
  }
}

/**
 * Add the given file to the provided list if it is within the max size (or
 * there is no max specified), modifying the existing array
 *
 * Additionally add its children if there are any, recursively
 *
 * @param file
 * @param list
 * @param max
 */
function addDirsLessThan(file: File, list: File[], max?: number) {
  if (file.type === FileType.DIR) {
    if (max === undefined || file.size <= max) {
      list.push(file);
    }
    for (const child of file.children) {
      addDirsLessThan(child, list, max);
    }
  }
}

function print(file: File, depth = 0) {
  const spacer = new Array(depth * 2).join(' ');
  const {name, type, size, children} = file;
  console.log(`${spacer}- ${name} (${type}, size=${size})`)

  for (const child of children) {
    print(child, depth + 1);
  }
}

const lines = readFile();

const rootDir: File = {
  name: '/',
  path: '/',
  size: 0,
  type: FileType.DIR,
  children: []
};
const dirMap = new Map<string, File>();
dirMap.set('/', rootDir);

let currentDir: File|undefined = rootDir;
let i = 0;
while (i < lines.length) {
  // change currentDir
  if (lines[i].includes('$ cd')) {
    const [_, dir] = lines[i].split('$ cd ');
    if (dir === '..') {
      currentDir = currentDir?.parent;
    } else {
      currentDir = dirMap.get(getPath(currentDir, dir));
    }
  }

  // list items
  else if (lines[i].includes('$ ls')) {
    // do nothing, the next lines will be the listed files
  }

  // this would be a file being listed, add to current dir
  else {
    const [size, name] = lines[i].split(' ');
    const isDir = size === FileType.DIR;
    const file = {
      name,
      path: getPath(currentDir, name),
      size: isDir ? 0 : Number(size),
      type: isDir ? FileType.DIR : FileType.FILE,
      children: [],
      parent: currentDir
    };
    addChild(currentDir, file);

    if (isDir) {
      dirMap.set(file.path, file);
    }
  }

  i++;
}

// just print the structure
print(rootDir);

// part 1, print sum of dirs <= 100000 total size
const files: File[] = [];
addDirsLessThan(rootDir, files, 100000);
console.log(files.reduce((size, file) => size + file.size, 0));

// part 2
const TOTAL_DISK_SPACE = 70000000;
const TARGET_FREE_SPACE = 30000000;
const remainingSpace = TOTAL_DISK_SPACE - rootDir.size;
const needToFreeUp = TARGET_FREE_SPACE - remainingSpace;

const allDirs: File[] = [];
addDirsLessThan(rootDir, allDirs);
allDirs.sort((a, b) => a.size - b.size);

const toDelete = allDirs.find(dir => dir.size > needToFreeUp);
console.log(toDelete!.size);