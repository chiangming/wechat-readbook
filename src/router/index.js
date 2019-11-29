import Vue from 'vue'
import VueRouter from 'vue-router'

const Discovery = () =>
  import('../views/discovery/Discovery.vue')
const Book = () =>
  import('../views/book/index.vue')
const Story = () =>
  import('../views/story/index.vue')
const Profile = () =>
  import('../views/profile/Profile.vue')

Vue.use(VueRouter)

const routes = [{
  path: '',
  redirect: '/discovery'
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
  base: process.env.BASE_URL,
  routes
})

export default router
