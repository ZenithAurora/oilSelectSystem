import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// 导出Excel函数
const exportToExcel = (dataSource, filename = '数据导出.xlsx') => {
  // 定义列头（与数据字段对应）
  const columns = [
    { key: 'ID', name: 'ID' },
    { key: 'WellName', name: '井名' },
    { key: 'Height', name: '深度(m)' },
    { key: 'Segment', name: '层段' },
    { key: 'Lithology', name: '岩性' },
    { key: 'TOC', name: '实测TOC(%)' },
    { key: 'S1', name: 'S1(mg/g)' },
    { key: 'S2', name: 'S2(mg/g)' },
    { key: 'TMax', name: '最高温度(℃)' },
    { key: 'PG', name: 'PG产烃量(mg/g)' },
    { key: 'HI', name: 'HI氢指数' },
    { key: 'GH', name: 'GH指数' },
    { key: 'Grade', name: '等级' }
  ];

  // 整理数据（将dataSource转换为xlsx所需格式）
  const sheetData = [columns.map(col => col.name), ...dataSource.map(row => columns.map(col => row[col.key]))];

  // 创建工作簿并添加工作表
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  // 添加到工作簿
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // 生成二进制数据
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // 创建Blob并保存文件
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, filename);
};

export default exportToExcel;