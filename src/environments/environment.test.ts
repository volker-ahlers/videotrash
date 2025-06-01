const docker_backend_url = 'http://localhost:9002/';
const docker_socket_url = 'ws://localhost:9002/';

export const environment = {
  production: false,
  name: 'testing',
  apiPath: '/api',
  docker_rest_service_url: docker_backend_url + 'config',
  docker_message_storage_url: docker_backend_url + 'db/messages',
  docker_message_update_url: docker_backend_url + 'message/categorise',
  docker_message_timeslot_url: docker_backend_url + 'message/timeslot',
  docker_message_labels_url: docker_backend_url + 'config/labels',
  websocket_path: docker_socket_url + 'alerts/ws',
  images_storage_url: '/assets/images/',
  documentationLink: './documentation/',
  azure_storage_url: `${docker_backend_url}azure-storage/sas/ai-video-streaming`,
};
