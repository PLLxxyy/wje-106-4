export const QUICK_ACTIONS = [
  { label: '记录饮食', path: '/diary/new' },
  { label: '查看日历', path: '/calendar' },
  { label: '统计分析', path: '/statistics' },
  { label: '食物库', path: '/foods' },
];

export const NUTRIENT_COLORS = {
  protein: '#2f6f5e',
  fat: '#d89c3f',
  carb: '#7e526b',
  calories: '#c94f39',
};

export const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];

export const RANGE_OPTIONS = [
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
] as const;

export const FORM_FIELD_LABELS = {
  date: '日期',
  meal: '餐次',
  note: '备注',
  mood: '心情',
  foodName: '食物名称',
  portion: '份量',
  unit: '单位',
  calories: '热量',
  protein: '蛋白质',
  fat: '脂肪',
  carb: '碳水',
  templateName: '模板名称',
};

export const BUTTON_LABELS = {
  save: '保存',
  delete: '删除',
  edit: '编辑',
  add: '添加',
  cancel: '取消',
  export: '导出数据',
  import: '导入数据',
  clear: '清空数据',
  useTemplate: '使用模板',
  manageTemplate: '管理模板',
  saveAsTemplate: '存为模板',
};
