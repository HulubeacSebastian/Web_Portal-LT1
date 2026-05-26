const PERMISSIONS = [
  { code: 'documents:read', description: 'Vizualizare documente' },
  { code: 'documents:create', description: 'Creare documente' },
  { code: 'documents:update', description: 'Actualizare documente' },
  { code: 'documents:delete', description: 'Stergere documente' },
  { code: 'documents:upload', description: 'Upload documente PDF' },
  { code: 'posts:create', description: 'Creare postari' },
  { code: 'posts:update', description: 'Actualizare postari' },
  { code: 'posts:delete', description: 'Stergere postari' },
  { code: 'generator:control', description: 'Pornire/oprire generator documente' },
  { code: 'chat:use', description: 'Participare la chat in timp real' }
];

const ADMIN_PERMISSIONS = PERMISSIONS.map((item) => item.code);

const USER_PERMISSIONS = ['documents:read', 'chat:use'];

const ROLE_DEFINITIONS = [
  {
    name: 'admin',
    description: 'Administrator — permisiuni complete',
    permissions: ADMIN_PERMISSIONS
  },
  {
    name: 'user',
    description: 'Utilizator standard — permisiuni restrictionate',
    permissions: USER_PERMISSIONS
  }
];

module.exports = {
  PERMISSIONS,
  ADMIN_PERMISSIONS,
  USER_PERMISSIONS,
  ROLE_DEFINITIONS
};
