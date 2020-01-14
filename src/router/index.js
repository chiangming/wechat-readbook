import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () =>
  import('../views/login.vue')
const Discovery = () =>
  import('../views/discovery/index.vue')
const Book = () =>
  import('../views/book/index.vue')
const Story = () =>
  import('../views/story/index.vue')
const Profile = () =>
  import('../views/profile/index.vue')

Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: '/mall'
},
{
  path: '/login',
  name: 'login',
  component: Login
},
{
  path: '/discovery',
  name: 'discovery',
  component: Discovery
},
{
  path: '/book',
  name: 'book',
  component: Book,
  children: [{
    path: ':fileName',
    component: () =>
        import('@components/ebook/EbookReader.vue')
  }]
},
{
  path: '/mall',
  name: 'mall',
  redirect: '/mall/shelf',
  component: () =>
      import('../views/mall/index.vue'),
  children: [{
    path: 'shelf',
    name: 'shelf',
    component: () =>
          import('../views/mall/bookShelf.vue')
  },
  {
    path: 'category',
    name: 'category',
    component: () =>
          import('../views/mall/bookCategory.vue')
  },
  {
    path: 'home',
    name: 'home',
    component: () =>
          import('../views/mall/mallHome.vue')
  },
  {
    path: 'list',
    name: 'list',
    component: () =>
          import('../views/mall/bookList.vue')
  },
  {
    path: 'total',
    name: 'total',
    component: () =>
          import('../views/mall/bookTotal.vue')
  },
  {
    path: 'detail',
    name: 'detail',
    component: () =>
          import('../views/mall/bookDetail.vue')
  }
  ]
},
{
  path: '/story',
  name: 'story',
  component: Story
},
{
  path: '/profile',
  name: 'profile',
  component: Profile
}
]

const router = new VueRouter({
  mode: 'history',
  base: '',
  routes
})

export default router
