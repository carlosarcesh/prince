/**
 * Created by Carlos Arce Sherader on 4/01/2018.
 */
import base from '../paths';

exports.lista_complejos = callback => {
    fetch(base.path.complejos, {
        method: 'POST',
        headers: base.default_headers,
        body: JSON.stringify({
            'complejo': null
        })
    }).then(response => {
        return response.json();
    }).then(data => {
        return callback(data, null);
    }).catch(err => {
        return callback(null, err);
    });
};