const express = require('express');
const { prisma } = require('../db/prisma');

const router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: {
          include: { permission: true }
        }
      },
      orderBy: { id: 'asc' }
    });

    return res.json(
      roles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map((entry) => ({
          code: entry.permission.code,
          description: entry.permission.description
        }))
      }))
    );
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
