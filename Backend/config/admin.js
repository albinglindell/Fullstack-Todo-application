module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '6f0ada28c088d2ae3488367ed0b7b0f4'),
  },
});
