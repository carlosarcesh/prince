import base from '../../paths';

function getAplicaciones() {
    var items = [];
    var request = new XMLHttpRequest();

    request.open('GET', base.path.lista_aplicaciones, false);
    //request.setRequestHeader('CP-Access-Token', '20dfe6c205234e231c55df2ea1cd4eab9f1dbc8781da99');
    request.send(null);


    if (request.status === 200) {
        var c = 0;
        JSON.parse(request.responseText).forEach((element) => {
            if (element.NApl_IdPadre === null) {
                var item = {
                    id: element.NApl_Id,
                    name: element.CApl_DesApl,
                    icon: element.CApl_Icono,
                    children: []
                };
                items.push(item);

                JSON.parse(request.responseText).forEach(_element => {
                    if(_element.NApl_Visible === 1) {
                        if (_element.NApl_IdPadre !== null) {
                            if (element.NApl_Id === _element.NApl_IdPadre) {
                                var children = {
                                    id: _element.NApl_Id,
                                    name: _element.CApl_DesApl,
                                    icon: _element.CApl_Icono,
                                    url: _element.CApl_Ruta
                                };
                                items[c].children.push(children);
                            }
                        }
                    }
                });

                c = c + 1;
            }
        });
    }
    return items;
}

export default getAplicaciones();