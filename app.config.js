// app.config.js
export default {
  expo: {
    name: 'ERP Ventas',
    slug: 'erp-ventas',
    version: '1.0.0',
    extra: {
      URL_BASE: 'http://192.168.1.102:8080/api',
      MODELOS: ['clientes', 'estados', 'ciudades', 'preguntas', 'categorias', 'formas-pago', 'condiciones-pago'],
    },
  },
};
