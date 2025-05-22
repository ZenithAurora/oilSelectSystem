/**
 * 自动为JSON数据中的井名生成中国境内静态坐标映射（简化版）
 * 
 * 这个函数是为了给一个数组中的井名生成中国境内的静态坐标映射，
 * 
 * 
 * 数组的数据格式如下： [ {"WellName":"PC1", 其他参数}  ]
 * 返回的对象格式是： { "PC1":[116.46, 39.92], "PC2":[116.47, 39.93], ... }
 * 
 * 纬度：lat 经度：lng
 */

function autoGenerateWellCoords(oilData) {
  // 预定义40个具体坐标点（按省份顺序排列）
  const ORIGINAL_COORD_LIST = [
    [75.98, 39.47],
    [109.02, 32.68],
    // [107.87, 35.71],
    [80.29, 41.17],
    [108.95, 34.27],
    [102.73, 31.48],
    [93.51, 42.82],
    [98.50, 39.73],
    [121.39, 37.52],
    [79.93, 37.12],
    [86.16, 41.77],
    [107.18, 34.46],
    [103.83, 36.06],
    [117.04, 36.67],
    [106.27, 38.47],
    [81.33, 43.91],
    [105.73, 34.58],
    [109.47, 36.60],
    [84.87, 45.59],
    // [118.49, 37.46],
    // [109.70, 38.29],
    // [106.18, 37.98],
    // [120.33, 36.07],
    // [100.07, 30.67],
    // [87.62, 43.82],
    // [106.39, 39.03],
    // [104.56, 29.77],
    // [106.28, 36.01],
    // [106.08, 30.83],
    // [107.03, 33.07],

  ];

  const COORD_LIST = [...ORIGINAL_COORD_LIST];
  // 提取唯一井名（保持首次出现顺序）
  const uniqueWells = [];
  const seen = new Set();
  for (const item of oilData) {
    if (!seen.has(item.WellName)) {
      seen.add(item.WellName);
      uniqueWells.push(item.WellName);
    }
  }

  // 按顺序分配坐标（超出40个则循环）
  const coordMap = {};
  uniqueWells.forEach((name, index) => {
    const coordIndex = index % COORD_LIST.length;
    coordMap[name] = [...COORD_LIST[coordIndex]]; // 确保坐标不可变
  });


  return coordMap;
}

export default autoGenerateWellCoords;