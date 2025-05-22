import React, { useState } from 'react';
import { Table, Modal, message } from 'antd';
import './index.scss';
import { deleteOilWellData, uploadOilWellData } from "@/store/models/oilWellData";
import { useDispatch } from 'react-redux';
import AddDataForm from '../AddDataForm/index';


const SpecialTable = ({ dataSource }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false); // 控制修改模态框显示
  const [editingRecord, setEditingRecord] = useState(null); // 存储当前编辑的记录

  const columns = [
    {
      title: 'ID',
      dataIndex: 'ID',
      key: 'ID',
      className: 'glitch-text',
      width: '80px',
    },
    {
      title: '井名',
      dataIndex: 'WellName',
      key: 'WellName',
      width: '60px',
      render: text => <span className="neon-text">{text}</span>
    },
    {
      title: '深度/m',
      dataIndex: 'Height',
      key: 'Height',
      width: '100px',
      sorter: (a, b) => a.Height - b.Height
    },
    {
      title: '层段',
      dataIndex: 'Segment',
      key: 'Segment',
      width: '100px',
    },
    {
      title: '岩性',
      dataIndex: 'Lithology',
      key: 'Lithology',
      width: '120px',
    },
    {
      title: '实测TOC',
      dataIndex: 'TOC',
      key: 'TOC',
      width: '160px',
      sorter: (a, b) => a.TOC - b.TOC
    },
    {
      title: 'S₁',
      dataIndex: 'S1',
      key: 'S1',
      width: '100px'
    },
    {
      title: 'S₂',
      dataIndex: 'S2',
      key: 'S2',
      width: '100px'
    },
    {
      title: '最高温度',
      dataIndex: 'TMax',
      key: 'TMax',
      width: '110px',
      sorter: (a, b) => a.TMax - b.TMax
    },
    {
      title: 'PG(产烃量)',
      dataIndex: 'PG',
      key: 'PG',
      width: '110px',
    },
    {
      title: 'HI',
      dataIndex: 'HI',
      key: 'HI',
      width: '100px',
    },
    {
      title: 'GH',
      dataIndex: 'GH',
      key: 'GH',
      width: '100px',
    },
    {
      title: 'Grade',
      dataIndex: 'Grade',
      key: 'Grade',
      width: '100px',
    },
    {
      title: '操作',
      key: 'action',
      width: '120px',
      render: (_, record) => (
        <div className="actions">
          <button
            className="hud-button"
            onClick={() => handleDelete(record.ID)}
          >
            删除
          </button>
          <button
            className="hud-button"
            onClick={() => handleEdit(record)}
          >
            修改
          </button>
        </div>
      )
    }
  ];

  // 删除确认模态框
  const handleDelete = (id) => {
    // console.log(id);
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该条数据吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        // 调用Redux删除操作
        dispatch(deleteOilWellData(id));
        message.success('数据删除成功！');
      }
    });
  };

  // 点击修改的时候，弹出模态框，同时将点击的这行数据给记录下来
  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingRecord(record); // 记录当前编辑的记录
  }


  // 处理表单提交（修改后的数据）
  const handleEditSubmit = (values) => {
    console.log("修改后：", values);

    // 合并修改后的数据到原始数据
    const updatedRecord = { ...editingRecord, ...values };
    // 调用Redux更新操作
    dispatch(uploadOilWellData(updatedRecord));
    message.success('数据修改成功！');
  };



  return (
    <div className="cyber-table-container">
      <Table
        columns={columns}
        dataSource={dataSource}
        className="cyber-table"
        scroll={{ x: 1500 }}
        pagination={{
          className: "cyber-pagination",
          // 每页显示条数
          showSizeChanger: false,
          pageSize: 9,
        }}
      />


      {/* 复用新增数据的表单组件，传递初始值 */}
      {/* 蒙层和新增表单 */}
      {isEditing && (
        <div className='mask'>
          <div className='modalWrapper'>
            <AddDataForm
              initialValues={editingRecord}
              onClose={() => setIsEditing(false)}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialTable;