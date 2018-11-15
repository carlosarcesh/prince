import cookie from "react-cookies";

/**
 * Created by Carlos Arce Sherader on 8/01/2018.
 */
exports.priceFormatter = (price) => {
    let pais = cookie.load('pais');
    if(pais == 'peru') {
        return parseFloat(price).toFixed(2);
    } else {
        return parseFloat(price).toFixed(0);
    }
};

exports.hasModuleEnabled = (idMod) => {
    const AplicativoRol = JSON.parse(cookie.load('response').replace('j:', ''));

    var result = false;
    for (var i = 0; i < AplicativoRol.length; i++) {
        if (AplicativoRol[i].NRolAp_IdAplicacion === idMod) {
            result = true;
            break;
        } else {
            result = false
        }
    }

    return result;
};

exports.getCountry = () => {
    return cookie.load('pais');
};