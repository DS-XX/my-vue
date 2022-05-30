export default[
  {
    name: 'productInit-list',
    path: '/du/business/basic',
    component: () => import('./view/business/basic'),
    meta: {
      title: '基础的内容'
    }
  },
  {
    name: 'productInit-list',
    path: '/du/door/tags',
    component: () => import('./view/door-tags/index'),
    meta: {
      title: '标签相关'
    }
  }
]
