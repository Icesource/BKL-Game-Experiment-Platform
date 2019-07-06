const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  email: state => state.user.email,
  phone: state => state.user.phone,
  school: state => state.user.school,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  language: state => state.app.language,
  studentId: state => state.user.studentId
}
export default getters
