
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setOilWellData } from '@/store/models/oilWellData';

import SpecialTable from './components/SpecialTable';
import SearchForm from './components/SearchForm';
import AddDataForm from './components/AddDataForm';
import style from './DataRecord.module.scss'
import OilData from '@/assets/json/oilData.json'

import exportToExcel from '@/utils/exportToExcel'; // 导出Excel工具函数


import { Button, message } from 'antd';
import * as XLSX from 'xlsx';

const DataRecord = () => {
  //控制新增数据表单的显示与隐藏
  const [addDataFormVisible, setAddDataFormVisible] = useState(false);
  const dispatch = useDispatch()
  let oilWellData = useSelector(store => store.oil.oilWellData)  // 【2】获取到仓库油井数据

  // 【1】获取静态数据并初始化
  useEffect(() => {
    dispatch(setOilWellData(OilData.oilData))
  }, [dispatch])


  //【3】上传文件
  const handleUpload = (e) => {
    const file = e.target.files[0];

    // 校验文件格式
    if (!file) {
      message.error('您还未选择文件呢！');
      return;
    } else if (!['.xlsx', '.xls'].includes(file.name.slice(-5))) {
      message.error('请选择Excel文件哟(˶ᵔ ᵕ ᵔ˶)');
      return;
    } else {
      // 生成读文件的示例对象
      const reader = new FileReader();


      // 编写下面代码的时候要注意i，必须先声明好回调事件，再去读取，因为 读取速度可能超过编译速度，这样就不会执行回调函数
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];// 获取第一个工作表的名称
        const worksheet = workbook.Sheets[firstSheetName];
        // console.log(worksheet);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        console.log(jsonData);

        // 提取数据行
        const tableData = jsonData.slice(1).map((row, i) => {
          const obj = {};
          row.forEach((cell, index) => {
            obj[index] = cell;
            obj.key = i;
          });
          return obj;
        });
        const dataSource = tableData.map((item, index) => {
          return {
            ID: index,
            WellName: item[0],
            Height: item[1],
            Segment: item[2],
            Lithology: item[3],
            TOC: item[4],
            S1: item[5],
            S2: item[6],
            TMax: item[7],
            PG: item[8],
            HI: item[9],
            GH: item[10],
            Grade: item[11]
          }
        })

        message.success('文件校验中...');
        if (dataSource.length === 0) {
          setTimeout(() => {
            message.error('系统无法匹配当前数据，请检查文件内容！');
            return;
          }, 1000)
        } else {
          setTimeout(() => {
            // 将数据存入仓库
            dispatch(setOilWellData(dataSource))
            message.success('文件导入成功！');
          }, 1000)
        }
      }

      // 声明好回调函数后，再去读取文件
      reader.readAsArrayBuffer(file);
    }
  };

  // 【4】新增数据
  const handleAddSubmit = (values) => {
    const maxId = oilWellData.reduce((max, item) => Math.max(max, item.ID), 0);
    const newData = {
      ...values,
      ID: maxId + 1  // 自动生成ID
    };

    dispatch(setOilWellData([...oilWellData, newData]));
    setAddDataFormVisible(false);
    message.success('新增数据成功！');
  };

  // 【5】导出Excel表
  const handleExport = () => {
    if (oilWellData.length === 0) {
      message.error('当前没有数据可供导出！');
      return;
    }
    const fileName = '油田数据.xlsx';
    exportToExcel(oilWellData, fileName);
  };


  return (
    <div className={style.container}>
      {/* 【1】搜索栏 */}
      <SearchForm />

      {/* 【2】操作按钮 */}
      <div style={{ display: 'flex', gap: 16 }} className="BtnGroup">
        {/* 上传文件的按钮 */}
        <label className="file-upload-label">
          <input
            type="file"
            className="uploadFileInput"
            onChange={handleUpload}
            accept=".xlsx, .xls"
          />
          <Button className="action-button upload-button">上传Excel表</Button>
        </label>
        <Button
          onClick={() => setAddDataFormVisible(true)}
          className="action-button add-button"
        >
          新增数据
        </Button>
        <Button
          onClick={handleExport}
          className="action-button export-button"
        >
          导出Excel表
        </Button>
      </div>

      {/* 【3】表格 */}
      <SpecialTable dataSource={oilWellData} />

      {/* 【4】新增数据的表单 */}
      {/* 蒙层和新增表单 */}
      {addDataFormVisible && (
        <div className={style.mask}>
          <div className={style.modalWrapper}>
            <AddDataForm
              initialValues={null}
              onClose={() => setAddDataFormVisible(false)}
              onSubmit={handleAddSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DataRecord;