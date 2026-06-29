export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // Auth
  authRegister: `${API_BASE_URL}/auth/register/`,
  authLogin: `${API_BASE_URL}/auth/login/`,
  authRefresh: `${API_BASE_URL}/auth/token/refresh/`,

  // Usuarios
  users: `${API_BASE_URL}/users/`,
  userMe: `${API_BASE_URL}/users/me/`,
  userProfileType: `${API_BASE_URL}/users/profile_type/`,

  // Cursos
  courses: `${API_BASE_URL}/courses/`,
  coursesBySemester: `${API_BASE_URL}/courses/by_semester/`,

  // Secciones
  sections: `${API_BASE_URL}/sections/`,
  sectionsByCoarse: `${API_BASE_URL}/sections/by_course/`,
  sectionsAvailable: `${API_BASE_URL}/sections/available/`,

  // Postulaciones
  postulations: `${API_BASE_URL}/postulations/`,
  myApplications: `${API_BASE_URL}/postulations/my_applications/`,
  apply: `${API_BASE_URL}/postulations/apply/`,

  // Historial
  history: `${API_BASE_URL}/history/`,
  myHistory: `${API_BASE_URL}/history/my_history/`,
};

export default API_ENDPOINTS;
