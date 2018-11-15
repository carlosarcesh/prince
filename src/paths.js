/**
 * Created by Carlos Arce Sherader on 3/01/2018.
 */
//const url = 'http://daredevil.cineplanet.com.pe';
const url = 'http://' + location.hostname;
const base_sql = url + '/api/v1/';
const base_ora = url + '/api/v2/';
const base_vis = url + '/api/v3/';

const url_ppl = 'http://10.45.1.70:7878';
const base_sql_ppl = url_ppl + '/api/';

exports.default_headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'CP-Access-Token': '20dfe6c205234e231c55df2ea1cd4eab9f1dbc8781da99'
};

exports.path = {
    'complejos': base_sql + 'complejos',
    'lista_aplicaciones': base_sql + 'aplicaciones',
    'transacciones_taquilla': base_sql + 'compras_exitosas/transacciones_taquilla',
    'transacciones_taquilla_det': base_sql + 'compras_exitosas/transacciones_taquilla_det',
    'transacciones_dulceria': base_sql + 'compras_exitosas/transacciones_dulceria',
    'transacciones_taquilla_fallidas': base_sql + 'compras_online/transacciones_taquilla',
    'transacciones_taquilla_det_fallidas': base_sql + 'compras_online/transacciones_taquilla_det',
    'transacciones_dulceria_fallidas': base_sql + 'compras_online/transacciones_dulceria',
    'consulta_voucher': base_sql + 'compras_online/consulta_voucher',
    'get_cines_funciones': base_sql + 'funciones/cines',
    'get_peliculas_funciones': base_sql + 'funciones/peliculas',
    'get_peliculas_cartelera': base_sql + 'marketing/get_peliculas_cartelera',
    'cartelera_upload': base_sql + 'marketing/upload',
    'get_pago_payu': base_sql + 'payu/get_pago_payu',
    'get_reference_code': base_sql + 'payu/get_reference_code',
    'get_datos_payu_by_reference': base_sql + 'payu/get_datos_payu_by_reference',
    'reversion_pago': base_sql + 'payu/reversion_pago',
    'libro_reclamos': base_sql + 'reclamos/lista_reclamos',
    'exportar_libro_reclamos': base_sql + 'reclamos/exportar_xls',
    'detalle_reclamo': base_sql + 'reclamos/detalle_reclamo',
    'actualizar_estado_libro_reclamo': base_sql + 'reclamos/actualizar_estado',
    'vista_reenvio_oc': base_vis + 'vista/reenviar_oc',
    'get_usuarios': base_sql + 'seguridad/usuarios',
    'get_roles': base_sql + 'seguridad/roles',
    'insertar_usuario': base_sql + 'seguridad/insertar_usuario',
    'editar_usuario': base_sql + 'seguridad/editar_usuario',
    'roles_modulo': base_sql + 'seguridad/roles_modulo',
    'modulos_rol': base_sql + 'seguridad/modulos_rol',
    'insertar_rol': base_sql + 'seguridad/insertar_rol',
    'editar_rol': base_sql + 'seguridad/editar_rol',
    'eliminar_rol': base_sql + 'seguridad/eliminar_rol',
    'generar_boletas': base_sql_ppl + 'generarBoletas',
    'consulta_cuadraturas': base_sql_ppl + 'consultarCuadraturas',
    'reversiones_audit': base_sql + 'audit/reversiones',
    'get_lotes': base_sql + 'ventas_corporativas/lotes',
    'get_clientes': base_sql + 'ventas_corporativas/clientes',
    'get_detalle_pase': base_sql + 'ventas_corporativas/detalle_pase',
    'get_orden_venta': base_sql + 'ventas_corporativas/ordenes_venta',
    'anular_vouchers': base_sql + 'ventas_corporativas/anular_vouchers',
    'get_detalle_factura': base_sql + 'ventas_corporativas/detalle_factura',
    'check_cliente': base_sql + 'ventas_corporativas/check_cliente',
    'get_vendedores': base_sql + 'ventas_corporativas/vendedores',
    'enviar_email': base_sql + 'mail/send',
};

exports.headers_ppl = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
};
