		(function () {
			define(["jquery", "datatables", "datatables-tabletools", "datatables-colvis"], function ($) {
				var achilles_heel = {};

				achilles_heel.render = function (datasource) {
					$('#reportAchillesHeel svg').remove();
				
					$.ajax({
						type: "GET",
						url: getUrlFromData(datasource, "achillesheel"),
						contentType: "application/json; charset=utf-8",
						success: function (data) {
							table_data = [];

							for (i = 0; i < data.MESSAGES.ATTRIBUTEVALUE.length; i++) {
								temp = data.MESSAGES.ATTRIBUTEVALUE[i];
								message_id = parseInt(data.MESSAGES.ATTRIBUTENAME[i]) || 0;
                                message_type = temp.substring(0, temp.indexOf(':'));
                                var icon = '';
                                if (message_type == 'ERROR')
                                {
                                    icon = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
                                }
                                else if (message_type == 'WARNING')
                                {
                                    icon = '<i class="fa fa-bell-o" aria-hidden="true"></i>';
                                }
                                else if (message_type == 'NOTIFICATION')
                                {
                                    icon = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
                                }
                                message_type = icon + message_type;
                                
								message_content = temp.substring(temp.indexOf(':') + 1);
                                
                                if (data.MESSAGES.hasOwnProperty('ANNOTATION'))
                                {
                                    message_annotation = data.MESSAGES.ANNOTATION[i];    
                                }
                                else
                                {
                                    message_annotation = 'NA';        
                                }
                                
								// RSD - A quick hack to put commas into large numbers.
								// Found the regexp at:
								// https://stackoverflow.com/questions/23104663/knockoutjs-format-numbers-with-commas
								message_content = message_content.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

								table_data[i] = {
                                    'id': message_id,
									'type': message_type,
									'content': message_content,
                                    'annotation': message_annotation
								};
							}

							datatable = $('#achillesheel_table').DataTable({
                                "createdRow": function(row, data, dataIndex) {
                                    if (data['type'].indexOf('ERROR') !== -1) {
                                        $(row).css({"background-color":"#ffdbdb"})
                                    }
                                    else if (data['type'].indexOf('WARNING') !== -1) {
                                        $(row).css({"background-color":"#fffedb"})
                                    }
                                    else if (data['type'].indexOf('NOTIFICATION') !== -1) {
                                        $(row).css({"background-color":"#e8f0ff"}) 
                                    }
                                },
								dom: 'lfrt<"row"<"col-sm-4" i ><"col-sm-4" T ><"col-sm-4" p >>',
								tableTools: {
            			         "sSwfPath": "js/swf/copy_csv_xls_pdf.swf"
        				        },
								data: table_data,
								columns: [
                                    {
										data: 'id',
										visible: true,
                                        width: 50
									},
									{
										data: 'type',
										visible: true,
										width:200
									},
									{
										data: 'content',
										visible: true
									},
                                    {
										data: 'annotation',
										visible: true,
                                        width: 400
									}
								],
								pageLength: 15,
								lengthChange: false,
								deferRender: true,
								destroy: true
							});

							$('#reportAchillesHeel').show();
						}
					});
				}

				return achilles_heel;
			});
		})();
