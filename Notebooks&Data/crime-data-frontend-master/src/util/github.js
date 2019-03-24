import http from 'axios'

const API = 'https://api.github.com'

export const createIssue = ({
  body,
  labels = ['feedback'],
  owner,
  repo,
  title,
  token,
}) => {
  const data = { body, labels, title }
  const headers = {
    Authorization: `token ${token}`,
    Accept: 'application/vnd.github.v3+json',
  }
  return http.post(`${API}/repos/${owner}/${repo}/issues`, data, { headers })
}
