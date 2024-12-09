async function readInputToString() {
  const string = await Deno.readTextFile("input.txt");
  return string;
}

function getBlocks(diskMap) {
  const blocks = [];
  let isData = true;
  let dataIndex = 0;
  for (const char of diskMap) {
    if (isData) {
      blocks.push(...Array(Number(char)).fill(dataIndex));
      dataIndex++;
    }
    if (!isData) {
      blocks.push(...Array(Number(char)).fill("."));
    }

    isData = !isData;
  }
  return { blocks, lastID: dataIndex - 1 };
}

function defragBlocks(blocks) {
  let nonContiguousBlocks = true;
  while (nonContiguousBlocks) {
    const lastDataIndex = (blocks.length - 1) -
      blocks
        .toReversed()
        .findIndex((element) => element != ".");
    const firstFreeIndex = blocks.indexOf(".");

    if (lastDataIndex < firstFreeIndex) {
      nonContiguousBlocks = false;
      continue;
    }

    // swap elements
    [blocks[firstFreeIndex], blocks[lastDataIndex]] = [
      blocks[lastDataIndex],
      blocks[firstFreeIndex],
    ];
  }

  return blocks;
}

function checksumBlocks(blocks) {
  return blocks.reduce((acc, id, index) => {
    if (id == ".") {
      return acc;
    }
    return acc + id * index;
  }, 0);
}

function defragChecksum(diskMap) {
  const { blocks } = getBlocks(diskMap);
  const defraggedBlocks = defragBlocks(blocks);
  const checksum = checksumBlocks(defraggedBlocks);
  return checksum;
}

function defragBlocks2(blocks, lastID) {
  for (let id = lastID; id >= 0; id--) {
    console.log("block ", id);
    // get data block length
    const firstBlock = blocks.indexOf(id);
    const lastBlock = blocks.lastIndexOf(id);
    const dataLength = lastBlock - firstBlock + 1;

    // look for free blocks where it can fit
    let nextFreeBlock = blocks.indexOf(".");
    while (nextFreeBlock != -1) {
      let freeBlockLength = 0;
      for (let i = nextFreeBlock; blocks[i] == "."; i++) {
        freeBlockLength++;
      }

      if (dataLength <= freeBlockLength && nextFreeBlock < firstBlock) {
        // swap blocks
        blocks.fill(id, nextFreeBlock, nextFreeBlock + dataLength);
        blocks.fill(".", firstBlock, lastBlock + 1);
        break;
      }

      nextFreeBlock = blocks.indexOf(".", nextFreeBlock + freeBlockLength);
    }
  }

  return blocks;
}

function defragChecksum2(diskMap) {
  console.log("getting blocks...");
  const { blocks, lastID } = getBlocks(diskMap);
  console.log("defragging blocks...");
  const defraggedBlocks = defragBlocks2(blocks, lastID);
  console.log("calculating checksum...");
  const checksum = checksumBlocks(defraggedBlocks);
  return checksum;
}

if (import.meta.main) {
  const diskMap = await readInputToString();
  console.log(defragChecksum(diskMap));
  console.log(defragChecksum2(diskMap));
}
