import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data,
  })
}
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  })
}
export function getInfo() {
  return request({
    url: '/auth/user',
    method: 'get',
  })
}

export function logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data,
  })
}

export function updatePassword(data) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data,
  })
}

export function confirmOTP(id, resource) {
  return request({
    url: `/auth/confirm-2fa-code/${id}`,
    method: 'put',
    data: resource,
  })
}
