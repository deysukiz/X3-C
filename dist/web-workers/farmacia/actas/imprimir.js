var document = { 'createElementNS': function(){ return {} } };
var window = this;
importScripts( '../../../scripts/pdfmake.min.js', '../../../scripts/vfs_fonts.js');

(function() { 
    'use strict';

    onmessage = function( evt ) {
        let data = JSON.parse(evt.data)
        //console.log(evt);
        pdf(data);
    };

    function pdf(acta) {
     //console.log(pedido);
     	try{
			var fecha = acta.fecha.split("-");
			var fechaContrato = acta.proveedor.contrato_activo.fecha_inicio.split("-");
			var meses = [];
			meses["01"] = "enero";
			meses["02"] = "febrero";
			meses["03"] = "marzo";
			meses["04"] = "abril";
			meses["05"] = "mayo";
			meses["06"] = "junio";
			meses["07"] = "julio";
			meses["08"] = "agosto";
			meses["09"] = "septiembre";
			meses["10"] = "octubre";
			meses["11"] = "noviembre";
			meses["12"] = "diciembre";

			var folios_pedidos_alternos = "";
			var contador = 0;
			for(var i = 0; i< acta.pedidos.length; i++){
				if(acta.pedidos[i].tipo_pedido_id == 'PALT'){
					if(contador > 0 && i < acta.pedidos.length - 1){
						folios_pedidos_alternos += ", ";
					}
					if( contador > 0 && i == acta.pedidos.length - 1){
						folios_pedidos_alternos += " y ";
					}
					folios_pedidos_alternos += acta.pedidos[i].folio;
					contador++;
				}
				
			}
			if(acta.pedidos.length > 1){
				folios_pedidos_alternos = "los Pedidos Alternos con folios: "+ folios_pedidos_alternos;
			} else {
				folios_pedidos_alternos = "el Pedido Alterno con folio: "+ folios_pedidos_alternos;
			}

			
			var dd = {
				content: [
						{	layout: {
							defaultBorder: false,
						},
						table: {
							headerRows: 2,							
							body: [
								[
									{
										image: 'header',
										width: 500,
										alignment: 'center' 
									}
								],
								["\n"],
								[
									{ 
										text: 'ACTA CIRCUNSTANCIADA POR DESABASTO DE MEDICAMENTOS Y MATERIAL DE CURACIÓN \nNo. ' + acta.folio, 
										style: 'header' 
									},
								],
								["\n"],
								[
									{
										text: "En la ciudad de " + acta.ciudad + " del Estado de Chiapas, siendo las " + acta.hora_inicio + " hrs. del día " + fecha[2] + " de " + meses[fecha[1]] + " del " + fecha[0] + ", nos encontramos reunidos en la " + acta.lugar_reunion + ", perteneciente a la Red de Servicios de hospitales del Instituto de Salud en el Estado, autoridades de este nosocomio con el objeto de inspeccionar, verificar los niveles de Abasto de insumos médicos del que resulta determinante el  desabasto e incumplimiento de la empresa " + acta.proveedor.nombre + ", considerando  los siguientes:",
										style:"parrafo"
									},
								],
								["\n"],
								[ { text: 'A N T E C E D E N T E S', style: 'subheader' } ],
								["\n"],
								[
									{ 
										text: [
											{
												text: "El personal que conforma la empresa " + acta.proveedor.nombre + ",que se encarga de dispensar los medicamentos y material de curación no ha mantenido el nivel de abasto optimo y necesario en la unidad, y a los cuales se comprometió de conformidad en el Contrato Abierto de Prestación de Servicios de fecha " + fechaContrato[2] + " de " + meses[fechaContrato[1]] + " del " + fechaContrato[0] + " que contrajo con este Instituto de Salud, que en su Cláusula Segunda, Numeral VIII,",
												bold:true
				
											},
											" que a la letra dice: "
										], style: "parrafo" 
									}
								],
								["\n"],
								[
									{
										text: [
											{
												text: '…“SEGUNDA. "EL PROVEEDOR" ',
												bold: true
				
											},
											"se obliga a lo siguiente:…"
				
										], style: "parrafo", italics:true
									},
								],
								[
									{
										
										text: [
											"…",
											{
												text: 'VIII. “EL PROVEEDOR”',
												bold: true
				
											},
											'deberá mantener en existencia las cantidades necesarias de medicamentos y material de curación en cada módulo de distribución para hacer frente cualquier eventualidad o emergencia. Si por alguna razón imputable a ',
											{
												text: '“EL PROVEEDOR”',
												bold: true
				
											},
											"llegara a existir faltante o desabasto de alguna clave de medicamentos o material de curación, para mantener la operatividad de las Unidades Médicas y no poner en riesgo la salud o incluso la vida misma de los usuarios de los servicios de salud brindados por ",
											{
												text: '“EL INSTITUTO”, “EL PROVEEDOR”',
												bold: true
				
											},
											' se compromete a surtir en un periodo máximo de ',
											{
												text: '24 horas',
												bold: true
				
											},
											' dichas claves; en caso de que terminado este plazo continuará el desabasto de medicamento o material de curación, entorpeciendo este acto el fin de privilegiar las acciones y medidas preventivas destinadas a evitar o mitigar el impacto negativo que tendría este hecho en la población, ',
											{
												text: '“EL INSTITUTO”',
												bold: true
				
											},
											' podrá efectuar la compra inmediata de los medicamentos y material de curación en el mercado local…'
				
										], style: "parrafo", italics:true
									},
								],
								[
									{
										
										text: [
											'...La compra de los medicamentos y material de curación que ',
											{
												text: '“EL INSTITUTO”',
												bold: true
				
											},
											'adquiera con motivo del desabasto de alguna de las claves será realizada por la Subdirección de Recursos Materiales, a solicitud expresa de la Dirección de Atención Médica…'
				
										], style: "parrafo", italics:true
									}
								],
								["\n"],
								[
									{
										ul: [
											{ 
												text: 'Han sido constantes las solicitudes hechas por este nosocomio a la empresa señalando sobre el desabasto y la problemática que este hecho ha originado, sin que esta atienda las necesidades de manera oportuna de las claves solicitadas en los términos del contrato ni emitido oficio de negativa de surtimiento alguno a las solicitudes que se hacen por medio de colectivos y/o recetas médicas.',
												style: "parrafo", bold: true
											},
											{ 
												text: 'En seguimiento al punto anterior es importante resaltar que ante el incumplimiento de esta cláusula, han transcurrido más de 24 horas, término en el cual la empresa debió solventar la emergencia de desabasto. ',
												style: "parrafo", bold: true
											},
											{ 
												text: 'Derivado de los puntos anteriores, y ante los no surtimientos continuos de las recetas médicas así como de los colectivos en los diferentes turnos de este hospital, matutino, vespertino, nocturno y fines de semana, ni se cumple con el sistema de vale/recetas, NO SE ESTA DANDO LA ATENCIÓN ADECUADA A LOS TRATAMIENTOS INDICADOS POR LOS MÉDICOS, NI OTORGANDO LAS CURACIONES QUE SE REALIZAN EN LOS DIFERENTES SERVICIOS DE LAS UNIDADES QUE CONFORMAN ESTE HOSPITAL, POR PARTE DEL PERSONAL DE ENFERMERÍA.',
												style: "parrafo", bold: true
											},
										]
									}
								],
								["\n"],
								[
									{
										
										text: "Derivado de lo anterior, se toman los siguientes: ", style: "parrafo", bold:true
									}
								],
								["\n"],
								[{ text: 'A C U E R D O S', style: 'subheader' }],
								["\n"],
								[
									{
										ol: [
											{ 
												text: [
													{ 
														text: 'La presente Acta Circunstanciada  POR DESABASTO DE MEDICAMENTOS Y MATERIAL DE CURACIÓN, se hará de conocimiento oficial a las Oficinas Centrales de la Secretaría de Salud, Dirigido a la Dirección de Atención Médica', 
														bold: true
													},
													' con el objeto de gestionar las acciones pertinentes para solventar la notable problemática generada por el desbasto de medicamentos y material de curación por parte de la Empresa ' + acta.proveedor.nombre + '. ',
													{ 
														text: 'con carácter de URGENTE.', 
														bold: true
													},
												],
												style: "parrafo"
											},
											{ 
												text: 'El contar con estos insumos, subsanaran las deficiencias del servicio brindado hasta el momento, dándole asistencia médica a los pacientes con el cual podrán tener mejores oportunidades de mejoría en su salud.',
												style: "parrafo", bold: true
											},
											{
												text: [
													{ 
														text: 'Se adjunta a este Informe, el listado de medicamentos y material de curación con las claves y las cantidades necesarias para cubrir y solventar el desabasto por un periodo de 15 días,', 
														bold: true
													},
													' en tanto ',
													{ 
														text: '“EL PROVEEDOR”', 
														bold: true
													},
													' restablece con normalidad el servicio de suministro, maniobras de trasportación, carga, descarga, conservación, dispensación, resguardo y control de los bienes y productos descritos en ' + folios_pedidos_alternos +' ',
													{ 
														text: 'los cuales son necesarios para continuar con la operatividad de este hospital, haciendo énfasis que con ello se vería beneficiado directamente los usuarios de salud, y evitaría un conflicto social y al interior del mismo.', 
														bold: true
													},
												],
												style: "parrafo"
											},
										]
									}
								],
								["\n"],
								[
									{
										text: 'Previa lectura de la presente y no habiendo más asunto que tratar, remítase en original al Instituto de Salud el presente Informe, por lo que se da por concluida la misma, siendo las ' + acta.hora_termino + ' hrs. Firmando para constancia en todas sus hojas al margen y al calce los que en ella intervinieron.',
										style: "parrafo", bold:true
									}
								],
								[	{
										layout: {
											defaultBorder: false
										},
										fontSize: 10,
										table:{
											widths: [220,'*',220],
											body: [
												[
													{
														layout: {
															defaultBorder: false
														},
														table: {
															widths: ['*'],
															body: [
																[
																	"\n\n\n\n\n"
																],
																[
																	{
																		border: [false, true, false, false],
																		text: acta.director.nombre,
																		alignment: "center",
																		bold: true
																	}
																],
																[
																	{
																		text: "DIRECTOR DE LA UNIDAD MÉDICA",
																		alignment: "center",
																		bold: true
																	}
																]
															]
														}
													},
													"",
													{
														layout: {
															defaultBorder: false
														},
														table: {
															widths: ['*'],
															body: [
																[
																	"\n\n\n\n\n"
																],
																[
																	{
																		border: [false, true, false, false],
																		text: acta.administrador.nombre,
																		alignment: "center",
																		bold: true
																	}
																],
																[
																	{
																		text: "ADMINISTRADOR DE LA UNIDAD MÉDICA",
																		alignment: "center",
																		bold: true
																	}
																]
															]
														}
													}
												]
											]
											

										}
									}
								],
								['\n'],
								[
									{
										
										layout: {
											defaultBorder: false
										},
										fontSize: 10,
										table: {
											widths: ['*',220,'*'],
											body: [
												[
													"","\n\n\n\n\n",""
												],
												[
													"",
													{
														border: [false, true, false, false],
														text: acta.persona_encargada_almacen.nombre,
														alignment: "center",
														bold: true
													},""
												],
												[
													"",
													{
														text: "RESPONSABLE DEL ALMACÉN",
														alignment: "center",
														bold: true
													},
													""
												]
											]
										}
									},
								],
								['\n\n\n\n\n'],
								[{ text: 'AUTORIZA', style: 'header' }],
								['\n'],
								[
									{
										
										layout: {
											defaultBorder: false
										},
										fontSize: 10,
										table: {
											widths: ['*',220,'*'],
											body: [
												[
													"","\n\n\n\n\n",""
												],
												[
													"",
													{
														border: [false, true, false, false],
														text: "DRA. LETICIA GUADALUPE MONTOYA LIÉVANO",
														alignment: "center",
														bold: true
													},""
												],
												[
													"",
													{
														text: "DIRECTORA DE ATENCIÓN MÉDICA",
														alignment: "center",
														bold: true
													},
													""
												]
											]
										}
									},
								]
								
							]
						}
					}
					
				],
				styles: {
					header: {
						fontSize: 11,
						bold: true,
						alignment: 'center',
						margin: [0, 0, 0, 10]
					},
					parrafo: {
						fontSize: 9,
						bold: false,
						alignment: 'justify',
						//margin: [0, 0, 0, 10]
					},
					subheader: {
						fontSize: 10,
						alignment: 'center',
						bold: true,
						margin: [0, 10, 0, 5]
					},
					tableExample: {
						margin: [0, 5, 0, 15]
					},
					tableHeader: {
						bold: true,
						fontSize: 13,
						color: 'black'
					},
					piePagina: {
						fontSize: 6
					}
				},
				defaultStyle: {
					// alignment: 'justify'
				},
				footer: function(currentPage, pageCount) { 
					return { style: 'piePagina', text: 'Página '+currentPage.toString() +' de '+ pageCount, alignment:'center'};
				},
				images:{
					header: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4RDuRXhpZgAATU0AKgAAAAgABAE7AAIAAAAMAAAISodpAAQAAAABAAAIVpydAAEAAAAYAAAQzuocAAcAAAgMAAAAPgAAAAAc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGluZm9ybWF0aWNhAAAFkAMAAgAAABQAABCkkAQAAgAAABQAABC4kpEAAgAAAAMwNQAAkpIAAgAAAAMwNQAA6hwABwAACAwAAAiYAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAxNjowODoyNCAxNDo1NjowMAAyMDE2OjA4OjI0IDE0OjU2OjAwAAAAaQBuAGYAbwByAG0AYQB0AGkAYwBhAAAA/+ELHmh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSfvu78nIGlkPSdXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQnPz4NCjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iPjxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+PHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9InV1aWQ6ZmFmNWJkZDUtYmEzZC0xMWRhLWFkMzEtZDMzZDc1MTgyZjFiIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iLz48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyI+PHhtcDpDcmVhdGVEYXRlPjIwMTYtMDgtMjRUMTQ6NTY6MDAuMDUwPC94bXA6Q3JlYXRlRGF0ZT48L3JkZjpEZXNjcmlwdGlvbj48cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0idXVpZDpmYWY1YmRkNS1iYTNkLTExZGEtYWQzMS1kMzNkNzUxODJmMWIiIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+PGRjOmNyZWF0b3I+PHJkZjpTZXEgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48cmRmOmxpPmluZm9ybWF0aWNhPC9yZGY6bGk+PC9yZGY6U2VxPg0KCQkJPC9kYzpjcmVhdG9yPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0n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',
					marca: 'data:image/png;base64,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'
				 }
				
			}

            
            pdfMake.createPdf( dd ).getBase64( function( base64 ) {
                postMessage( { fileName: acta.folio, base64: base64} );
            });
        }catch(e){
            console.log(e);
            throw {error:e};
        }
    }

    /**
     * Number.prototype.format(n, x)
     * 
     * @param integer n: length of decimal
     * @param integer x: length of sections
     */
    Number.prototype.format = function(n, x) {
        var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
        return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
    };
})();
