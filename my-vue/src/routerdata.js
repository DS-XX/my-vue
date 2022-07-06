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
  },
  {
    name: 'login',
    path: '/du/login',
    component: () => import('./view/login/index'),
    meta: {
      title: '登录'
    }
  },
  {
    name: 'newSelect',
    path: '/du/newSelect',
    component: () => import('./view/new-select/index'),
    meta: {
      title: '新的选额'
    }
  },
  {
    name: 'nodeTest',
    path: '/du/nodeTest',
    component: ()=>import('./view/nodeTest/index'),
    meta: {
      title: 'node的test'
    }
  },
  {
    name: 'register',
    path: '/du/register',
    component: ()=>import('./view/nodeTest/register'),
    meta: {
      title: 'register'
    }
  }
]
