import Vue from 'vue'
import VueRouter from 'vue-router'

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
  base: '/',
  path: '',
  redirect: '/mall'
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
    component: () =>
          import('../views/mall/bookShelf.vue')
  },
  {
    path: 'category',
    component: () =>
          import('../views/mall/bookCategory.vue')
  },
  {
    path: 'home',
    component: () =>
          import('../views/mall/mallHome.vue')
  },
  {
    path: 'list',
    component: () =>
          import('../views/mall/bookList.vue')
  },
  {
    path: 'detail',
    component: () =>
          import('../views/mall/bookDetail.vue')
  },
  {
    path: 'detail-more',
    component: () =>
          import('../views/mall/bookDetailMore.vue')
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
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
