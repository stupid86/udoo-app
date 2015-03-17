/* 	
function check_device(){
  
	var mobileKeyWords = new Array('iPhone', 'iPod', 'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
	var device_name = '';
	
	for (var word in mobileKeyWords){
	
		if (navigator.userAgent.match(mobileKeyWords[word]) != null) {
			device_name = mobileKeyWords[word];
			break;
		 
		}
	}
	return device_name;
}
*/

/*	
 * FIX Command 4: Feed, Eject, Mode, Model value
 */
 
var accounts = 	{ 
					master:'1', admin:'2', 
					engineer:'3', operator:'4' 
				};
				
var account_id = 	{ 
						current:'operator', past_id:'operator', select: 'operator'
					};
var current_account = accounts.operator;	// init operator, modify: 0126
var pass_init_id;
/*
var current_account = accounts.admin;	// init admin, modify: 0126
account_id.past_id = 'admin';
*/

var once_eject_flag = 0;
var once_feed_flag = 0;
var addr_read_cnt = 0;

var ID = '01';		// default '01'
var Command = '1'; 	// default '1'
var address;
var value;

var program_init_flag = 0;
var avr_data = new Array();	// avr read data
var avr_addrs = new Array();
var avr_datas = new Array();

/* Validate objects */

var validate_flag = true;
var valid_flag = 	{
						stop_1: true, stop_2: true, stop_3: true, 
						stop_4: true, stop_5: true, stop_6: true	
					};
var date_vals = { 
					stop_1: '-', stop_2: '-', stop_3: '-', 
					stop_4: '-', stop_5: '-', stop_6: '-',
				};
   
var date_onoff_vals = 	{ 
							stop_1: 0, stop_2: 0, stop_3: 0, 
							stop_4: 0, stop_5: 0, stop_6: 0	
						};
							
// state 0: init
// state 1: admin
const pass_flags = {length:'length', differ:'differ', special:'special'};
var server_pass_info = { state:'0', ack_flag:'0' };		
var pass = { old_val:'', new_val:'', confirm_val:''};
var pass_flag='';
var pass_error_id;

/* password check: Should always be stored */ 
var pass_match_processes = 	{ 
								validate:1, validate_unlock:2,
								account: 3, date_time: 4
							};
var pass_match_process;		// password check process

var alert_flag = 	{ 
						mode:0, pass_change:1, init:2, 
						date_time:3, mode_change:4 
					};
var alert_flag_parent;	// alert dialog : flag store

var user = { name:' ', past_name:' ' };

var AckNack;		// Ack or Nack Store	
const STX = 2;		// STX: AVR, Udoo, Html Const
// const STX = '\2';	// STX: AVR, Udoo, Html Const
// const ETX = '\3';	// STX: AVR, Udoo, Html Const
const ACK = '8';	
const NACK = '9';
var nack_addr, nack_value;
var timer, auto_timer, auto_start_timer, 
	shutdown_timer, mode_timer, feed_condi_timer, timer_cnt=0;
var err_check_timer;

var mode_change_flag = 0;
var step_color = [ "Gold", "MidnightBlue", "Maroon" ];
var past_dialog_title;

var device_addr;
var device_val;
var device_TEXT;								

// menu, start menu open toggle value
var menu_toggle = 0, start_menu_toggle=0;

// rgb dialog state, addresss
var current_rgb_dialog_state;
var current_adv_rgb_address;

// System on off addr, value
var system_onoff_addr = '0x100';
var system_onoff_val_off = 1;

// Eject and Feed on off address
var Eject_Feed_onoff_addr = { EjectOnOff:'0x600', FeedOnOff:'0x201' };

// Eject and Feed on off value, default: off(0)
var Eject_Feed_onoff_val = { EjectOnOff:0, FeedOnOff:0 };

// Eject and Feed on off ID value 
var ID_Eject_Feed_onoff_addr = { EjectOnOff:'#eject', FeedOnOff:'#feed' };

// Mode Name Read obj : 0x020(count 20) ~ 0x0BF
var mode_name_addr = 	{ 
							mode_1:'0x020', mode_2:'0x034', mode_3:'0x048', 
							mode_4:'0x05c', mode_5:'0x070', mode_6:'0x084', 
							mode_7:'0x098', mode_8:'0x0ac'
						};

var mode_name_val = 	{ 
							mode_1:'', mode_2:'', mode_3:'', 
							mode_4:'', mode_5:'', mode_6:'', 
							mode_7:'', mode_8:''
						};
						
var mode_name_arr = new Array(20);

// Mode object value
var mode_addr = { mode:'0x005' };
var mode_val = { mode: 0, past_val: 0 };
var ID_mode_val = { mode:'#menu_title_2' };	
var mode_name;
var mode_names = 	{
						mode_1:'MODE 1', mode_2:'MODE 2', mode_3:'MODE 3', mode_4:'MODE 4', 
						mode_5:'MODE 5', mode_6:'MODE 6', mode_7:'MODE 7', mode_8:'MODE 8'
					};
var past_mode_name;
var select_mode_id;

// Mode Func obj, value					
var mode_func_addr = { backup:'0x006' , recovery:'0x007', load:'0x008', source:'0x009'};
var mode_btns_id;	// mode current click id store
var mode_num;

// date value
var date_config_vals = { 
					year:0, month:0, day:0, 
					hour:0, min:0, sec:0,
					past_year:0, past_month:0, past_day:0, 
					past_hour:0, past_min:0, past_sec:0
				};
var date_time_config_str;
var date_time_str;
				
// All device address
var device_addr_1 = { 	
						Feed:'0x20A',
						Defect:'0x461',
						Pxl:'0x42F',
						B_D_S: '0x46D', 
						B_D_C: '0x46E', 
						B_L_S: '0x46F', 
						B_L_C: '0x470', 
						G_D_S: '0x471', 
						G_D_C: '0x472', 
						G_L_S: '0x473', 
						G_L_C: '0x474', 
						R_D_S: '0x475', 
						R_D_C: '0x476', 
						R_L_S: '0x477', 
						R_L_C: '0x478',
						B_D_S_ON: '0x405', 
						B_D_C_ON: '0x406', 
						B_L_S_ON: '0x407', 
						B_L_C_ON: '0x408', 
						G_D_S_ON: '0x409', 
						G_D_C_ON: '0x40A', 
						G_L_S_ON: '0x40B', 
						G_L_C_ON: '0x40C', 
						R_D_S_ON: '0x40D', 
						R_D_C_ON: '0x40E', 
						R_L_S_ON: '0x40F', 
						R_L_C_ON: '0x410'
						
					};

var device_addr_2 = { 	
						Feed:'0x20B', 
						Defect:'0x462',
						Pxl:'0x430',
						B_D_S: '0x479',
						B_D_C: '0x47A',
						B_L_S: '0x47B',
						B_L_C: '0x47C',
						G_D_S: '0x47D',
						G_D_C: '0x47E', 
						G_L_S: '0x47F', 
						G_L_C: '0x480',
						R_D_S: '0x481',
						R_D_C: '0x482',
						R_L_S: '0x483',
						R_L_C: '0x484',
						B_D_S_ON: '0x411', 
						B_D_C_ON: '0x412', 
						B_L_S_ON: '0x413', 
						B_L_C_ON: '0x414', 
						G_D_S_ON: '0x415', 
						G_D_C_ON: '0x416', 
						G_L_S_ON: '0x417', 
						G_L_C_ON: '0x418', 
						R_D_S_ON: '0x419', 
						R_D_C_ON: '0x41A', 
						R_L_S_ON: '0x41B', 
						R_L_C_ON: '0x41C'
					};				
				
var device_addr_3 = {	
						Feed:'0x20C',
						Defect:'0x463',
						Pxl:'0x431',
						B_D_S: '0x485',
						B_D_C: '0x486',
						B_L_S: '0x487',
						B_L_C: '0x488',
						G_D_S: '0x489',
						G_D_C: '0x48A',
						G_L_S: '0x48B',
						G_L_C: '0x48C',
						R_D_S: '0x48D',
						R_D_C: '0x48E',
						R_L_S: '0x48F',
						R_L_C: '0x490',
						B_D_S_ON: '0x41D', 
						B_D_C_ON: '0x41E', 
						B_L_S_ON: '0x41F', 
						B_L_C_ON: '0x420', 
						G_D_S_ON: '0x421', 
						G_D_C_ON: '0x422', 
						G_L_S_ON: '0x423', 
						G_L_C_ON: '0x424', 
						R_D_S_ON: '0x425', 
						R_D_C_ON: '0x426', 
						R_L_S_ON: '0x427', 
						R_L_C_ON: '0x428'
					};				
			
var device_val_1 = { 	
                        Feed:30,
						Defect:1,
						Pxl:1,
						B_D_S: 100, 
						B_D_C: 120, 
						B_L_S: 100, 
						B_L_C: 120, 
						G_D_S: 100, 
						G_D_C: 120, 
						G_L_S: 100, 
						G_L_C: 120, 
						R_D_S: 100, 
						R_D_C: 120, 
						R_L_S: 100, 
						R_L_C: 120,
						B_D_S_ON: 1, 
						B_D_C_ON: 1, 
						B_L_S_ON: 1, 
						B_L_C_ON: 1, 
						G_D_S_ON: 1, 
						G_D_C_ON: 1, 
						G_L_S_ON: 1, 
						G_L_C_ON: 1, 
						R_D_S_ON: 1, 
						R_D_C_ON: 1, 
						R_L_S_ON: 1, 
						R_L_C_ON: 1,
						Feed_past:30,
						Defect_past:1,
						Defect_pxl_past:1,
						B_D_S_past:100,
						B_D_C_past:100,
						B_L_S_past:100,
						B_L_C_past:100,
						G_D_S_past:100,
						G_D_C_past:100,
						G_L_S_past:100,
						G_L_C_past:100,
						R_D_S_past:100,
						R_D_C_past:100,
						R_L_S_past:100,
						R_L_C_past:100
						
					};
				
var device_val_2 = { 	
                        Feed:30,
						Defect:1,
						Pxl:1,
						B_D_S: 100, 
						B_D_C: 120, 
						B_L_S: 100, 
						B_L_C: 120, 
						G_D_S: 100, 
						G_D_C: 120, 
						G_L_S: 100, 
						G_L_C: 120, 
						R_D_S: 100, 
						R_D_C: 120, 
						R_L_S: 100, 
						R_L_C: 120,
						B_D_S_ON: 1, 
						B_D_C_ON: 1, 
						B_L_S_ON: 1, 
						B_L_C_ON: 1, 
						G_D_S_ON: 1, 
						G_D_C_ON: 1, 
						G_L_S_ON: 1, 
						G_L_C_ON: 1, 
						R_D_S_ON: 1, 
						R_D_C_ON: 1, 
						R_L_S_ON: 1, 
						R_L_C_ON: 1,
						Feed_past:30,
						Defect_past:1,
						Defect_pxl_past:1,
						B_D_S_past:100,
						B_D_C_past:100,
						B_L_S_past:100,
						B_L_C_past:100,
						G_D_S_past:100,
						G_D_C_past:100,
						G_L_S_past:100,
						G_L_C_past:100,
						R_D_S_past:100,
						R_D_C_past:100,
						R_L_S_past:100,
						R_L_C_past:100
					};
					
var device_val_3 = { 	
                        Feed:30,
						Defect:1,
						Pxl:1,
						B_D_S: 100, 
						B_D_C: 120, 
						B_L_S: 100, 
						B_L_C: 120, 
						G_D_S: 100, 
						G_D_C: 120, 
						G_L_S: 100, 
						G_L_C: 120, 
						R_D_S: 100, 
						R_D_C: 120, 
						R_L_S: 100, 
						R_L_C: 120,
						B_D_S_ON: 1, 
						B_D_C_ON: 1, 
						B_L_S_ON: 1, 
						B_L_C_ON: 1, 
						G_D_S_ON: 1, 
						G_D_C_ON: 1, 
						G_L_S_ON: 1, 
						G_L_C_ON: 1, 
						R_D_S_ON: 1, 
						R_D_C_ON: 1, 
						R_L_S_ON: 1, 
						R_L_C_ON: 1,
						Feed_past:30,
						Defect_past:1,
						Defect_pxl_past:1,
						B_D_S_past:100,
						B_D_C_past:100,
						B_L_S_past:100,
						B_L_C_past:100,
						G_D_S_past:100,
						G_D_C_past:100,
						G_L_S_past:100,
						G_L_C_past:100,
						R_D_S_past:100,
						R_D_C_past:100,
						R_L_S_past:100,
						R_L_C_past:100
						
					};
					
var device_TEXT_1 = { 	
						Feed:'1st Feed', Feed_Adv:'Feed',
						Defect:'1st Spot Size Pixel',
						Pxl:'1st Color Size Pixel',
						B_D_S: '1st Blue Dark Spot', 
						B_D_C: '1st Blue Dark Color', 
						B_L_S: '1st Blue Light Spot',
						B_L_C: '1st Blue Light Color', 
						G_D_S: '1st Green Dark Spot', 
						G_D_C: '1st Green Dark Color', 
						G_L_S: '1st Green Light Spot', 
						G_L_C: '1st Green Light Color', 
						R_D_S: '1st Red Dark Spot', 
						R_D_C: '1st Red Dark Color', 
						R_L_S: '1st Red Light Spot', 
						R_L_C: '1st Red Light Color'
					};					

var device_TEXT_2 = { 	
						Feed:'2nd Feed', Feed_Adv:'Feed',
						Defect:'2nd Spot Size Pixel',
						Pxl:'2nd Color Size Pixel',
						B_D_S: '2nd Blue Dark Spot', 
						B_D_C: '2nd Blue Dark Color', 
						B_L_S: '2nd Blue Light Spot',
						B_L_C: '2nd Blue Light Color', 
						G_D_S: '2nd Green Dark Spot', 
						G_D_C: '2nd Green Dark Color', 
						G_L_S: '2nd Green Light Spot', 
						G_L_C: '2nd Green Light Color', 
						R_D_S: '2nd Red Dark Spot', 
						R_D_C: '2nd Red Dark Color', 
						R_L_S: '2nd Red Light Spot', 
						R_L_C: '2nd Red Light Color'
					};

var device_TEXT_3 = { 	
						Feed:'3rd Feed', Feed_Adv:'Feed',
						Defect:'3rd Spot Size Pixel',
						Pxl:'3rd Color Size Pixel',
						B_D_S: '3rd Blue Dark Spot', 
						B_D_C: '3rd Blue Dark Color', 
						B_L_S: '3rd Blue Light Spot',
						B_L_C: '3rd Blue Light Color', 
						G_D_S: '3rd Green Dark Spot', 
						G_D_C: '3rd Green Dark Color', 
						G_L_S: '3rd Green Light Spot', 
						G_L_C: '3rd Green Light Color', 
						R_D_S: '3rd Red Dark Spot', 
						R_D_C: '3rd Red Dark Color', 
						R_L_S: '3rd Red Light Spot', 
						R_L_C: '3rd Red Light Color'
					};	

/* Device Address HTML ID Define ============================================= */					
var ID_device_addr_1 = { 	
							Feed:'#Feed_val',
							Defect:'#Defect_val',
							Pxl: '#defect_pxl',
							B_D_S: '#B_D_S', 
							B_D_C: '#B_D_C', 
							B_L_S: '#B_L_S', 
							B_L_C: '#B_L_C', 
							G_D_S: '#G_D_S', 
							G_D_C: '#G_D_C', 
							G_L_S: '#G_L_S', 
							G_L_C: '#G_L_C', 
							R_D_S: '#R_D_S', 
							R_D_C: '#R_D_C', 
							R_L_S: '#R_L_S', 
							R_L_C: '#R_L_C',
							B_D_S_ON: '#RGB_ONOFF', 
							B_D_C_ON: '#RGB_ONOFF', 
							B_L_S_ON: '#RGB_ONOFF', 
							B_L_C_ON: '#RGB_ONOFF', 
							G_D_S_ON: '#RGB_ONOFF', 
							G_D_C_ON: '#RGB_ONOFF', 
							G_L_S_ON: '#RGB_ONOFF', 
							G_L_C_ON: '#RGB_ONOFF', 
							R_D_S_ON: '#RGB_ONOFF', 
							R_D_C_ON: '#RGB_ONOFF', 
							R_L_S_ON: '#RGB_ONOFF', 
							R_L_C_ON: '#RGB_ONOFF'							
						};

var ID_device_addr_2 = { 	
							Feed:'#Feed_val',
							Defect:'#Defect_val',
							Pxl:'#defect_pxl',
							B_D_S: '#B_D_S', 
							B_D_C: '#B_D_C', 
							B_L_S: '#B_L_S', 
							B_L_C: '#B_L_C', 
							G_D_S: '#G_D_S', 
							G_D_C: '#G_D_C', 
							G_L_S: '#G_L_S', 
							G_L_C: '#G_L_C', 
							R_D_S: '#R_D_S', 
							R_D_C: '#R_D_C', 
							R_L_S: '#R_L_S', 
							R_L_C: '#R_L_C',
							B_D_S_ON: '#RGB_ONOFF', 
							B_D_C_ON: '#RGB_ONOFF', 
							B_L_S_ON: '#RGB_ONOFF', 
							B_L_C_ON: '#RGB_ONOFF', 
							G_D_S_ON: '#RGB_ONOFF', 
							G_D_C_ON: '#RGB_ONOFF', 
							G_L_S_ON: '#RGB_ONOFF', 
							G_L_C_ON: '#RGB_ONOFF', 
							R_D_S_ON: '#RGB_ONOFF', 
							R_D_C_ON: '#RGB_ONOFF', 
							R_L_S_ON: '#RGB_ONOFF', 
							R_L_C_ON: '#RGB_ONOFF'
						};				
				
var ID_device_addr_3 = {	
							Feed:'#Feed_val',
							Defect:'#Defect_val',
							Pxl:'#defect_pxl',
							B_D_S: '#B_D_S', 
							B_D_C: '#B_D_C', 
							B_L_S: '#B_L_S', 
							B_L_C: '#B_L_C', 
							G_D_S: '#G_D_S', 
							G_D_C: '#G_D_C', 
							G_L_S: '#G_L_S', 
							G_L_C: '#G_L_C', 
							R_D_S: '#R_D_S', 
							R_D_C: '#R_D_C', 
							R_L_S: '#R_L_S', 
							R_L_C: '#R_L_C',
							B_D_S_ON: '#RGB_ONOFF', 
							B_D_C_ON: '#RGB_ONOFF', 
							B_L_S_ON: '#RGB_ONOFF', 
							B_L_C_ON: '#RGB_ONOFF', 
							G_D_S_ON: '#RGB_ONOFF', 
							G_D_C_ON: '#RGB_ONOFF', 
							G_L_S_ON: '#RGB_ONOFF', 
							G_L_C_ON: '#RGB_ONOFF', 
							R_D_S_ON: '#RGB_ONOFF', 
							R_D_C_ON: '#RGB_ONOFF', 
							R_L_S_ON: '#RGB_ONOFF', 
							R_L_C_ON: '#RGB_ONOFF'
						};

var adv_feed_id;
						
// Adv Dialog bt, text address
var adv_feed_addr = {	
						Feed_mode: '0x200', Feed_enable_1:'0x202', Feed_enable_2:'0x203', 
						Feed_enable_3:'0x204', Feed_enable_4:'0x205', Feed_enable_5:'0x206', 
						Feed_enable_6:'0x207', Feed_enable_7:'0x208', Feed_enable_8:'0x209',
						Feed_individual_1:'0x20D', Feed_individual_2:'0x20E', Feed_individual_3:'0x20F',
						Feed_individual_4:'0x210', Feed_individual_5:'0x211', Feed_individual_6:'0x212',		
						Feed_individual_7:'0x213', Feed_individual_8:'0x214',
						Feed_allocation_information_1:'0x003', Feed_allocation_information_2:'0x004'
					};

// Adv Dialog bt, text value
// Feed_mode manual:0, auto:1
var adv_feed_val =	{	
						Feed_mode: '0', Feed_enable_1:'0', Feed_enable_2:'0', 
						Feed_enable_3:'0', Feed_enable_4:'0', Feed_enable_5:'0', 
						Feed_enable_6:'0', Feed_enable_7:'0', Feed_enable_8:'0',
						Feed_individual_1:8, Feed_individual_2:8, Feed_individual_3:8,
						Feed_individual_4:8, Feed_individual_5:8, Feed_individual_6:8,		
						Feed_individual_7:8, Feed_individual_8:8,
						Feed_allocation_information_1:0, Feed_allocation_information_2:0
					};

// Adv Dialog bt, text ID address
var ID_adv_feed_addr = 	{
							Feed_mode: '#Adv_feed_manual_auto', Feed_enable_1:'#Feed_enable_1', Feed_enable_2:'#Feed_enable_2', 
							Feed_enable_3:'#Feed_enable_3', Feed_enable_4:'#Feed_enable_4', Feed_enable_5:'#Feed_enable_5', 
							Feed_enable_6:'#Feed_enable_6', Feed_enable_7:'#Feed_enable_7', Feed_enable_8:'#Feed_enable_8',
							Feed_individual_1:'#Feed_individual_1', Feed_individual_2:'#Feed_individual_2', Feed_individual_3:'#Feed_individual_3',
							Feed_individual_4:'#Feed_individual_4', Feed_individual_5:'#Feed_individual_5', Feed_individual_6:'#Feed_individual_6',		
							Feed_individual_7:'#Feed_individual_7', Feed_individual_8:'#Feed_individual_8',
							Feed_allocation_information_1:'#feed_toggle_4', Feed_allocation_information_2:'#feed_toggle_8'	
						};

var adv_rgb_addr;	// adv dialog rgb address : BDS ~ RLC (Address)
var adv_rgb_val;	// adv dialog rgb value : BDS ~ RLC(a1~a8, b1~b8)
var adv_rgb_id;		// adv dialog camera value - id store

/* Camera RGB Address ( a1 ~ a8, b1 ~ b8 ) TOP*/
var B_D_S_CamAddr = {	a1:'0x500', a2:'0x501', a3:'0x502',
						a4:'0x503', a5:'0x504', a6:'0x505',		
						a7:'0x506', a8:'0x507',
						b1:'0x508', b2:'0x509', b3:'0x50A',
						b4:'0x50B', b5:'0x50C', b6:'0x50D',		
						b7:'0x50E', b8:'0x50F'
					};
						
var B_D_C_CamAddr = {	a1:'0x510', a2:'0x511', a3:'0x512',
						a4:'0x513', a5:'0x514', a6:'0x515',		
						a7:'0x516', a8:'0x517',
						b1:'0x518', b2:'0x519', b3:'0x51A',
						b4:'0x51B', b5:'0x51C', b6:'0x51D',		
						b7:'0x51E', b8:'0x51F'
					};
var B_L_S_CamAddr = { 	a1:'0x520', a2:'0x521', a3:'0x522',
						a4:'0x523', a5:'0x524', a6:'0x525',		
						a7:'0x526', a8:'0x527',
						b1:'0x528', b2:'0x529', b3:'0x52A',
						b4:'0x52B', b5:'0x52C', b6:'0x52D',		
						b7:'0x52E', b8:'0x52F'
					};		
var B_L_C_CamAddr = { 	a1:'0x530', a2:'0x531', a3:'0x532',
						a4:'0x533', a5:'0x534', a6:'0x535',		
						a7:'0x536', a8:'0x537',
						b1:'0x538', b2:'0x539', b3:'0x53A',
						b4:'0x53B', b5:'0x53C', b6:'0x53D',		
						b7:'0x53E', b8:'0x53F'
					};
var G_D_S_CamAddr = { 	a1:'0x540', a2:'0x541', a3:'0x542',
						a4:'0x543', a5:'0x544', a6:'0x545',		
						a7:'0x546', a8:'0x547',
						b1:'0x548', b2:'0x549', b3:'0x54A',
						b4:'0x54B', b5:'0x54C', b6:'0x54D',		
						b7:'0x54E', b8:'0x54F'
					}; 
var G_D_C_CamAddr = {	 a1:'0x550', a2:'0x551', a3:'0x552',
						a4:'0x553', a5:'0x554', a6:'0x555',		
						a7:'0x556', a8:'0x557',
						b1:'0x558', b2:'0x559', b3:'0x55A',
						b4:'0x55B', b5:'0x55C', b6:'0x55D',		
						b7:'0x55E', b8:'0x55F'
					}; 
	
var G_L_S_CamAddr = {	a1:'0x560', a2:'0x561', a3:'0x562',
						a4:'0x563', a5:'0x564', a6:'0x565',		
						a7:'0x566', a8:'0x567',
						b1:'0x568', b2:'0x569', b3:'0x56A',
						b4:'0x56B', b5:'0x56C', b6:'0x56D',		
						b7:'0x56E', b8:'0x56F'
					};
var G_L_C_CamAddr = { 	a1:'0x570', a2:'0x571', a3:'0x572',
						a4:'0x573', a5:'0x574', a6:'0x575',		
						a7:'0x576', a8:'0x577',
						b1:'0x578', b2:'0x579', b3:'0x57A',
						b4:'0x57B', b5:'0x57C', b6:'0x57D',		
						b7:'0x57E', b8:'0x57F'
					};
var R_D_S_CamAddr = { 	a1:'0x580', a2:'0x581', a3:'0x582',
						a4:'0x583', a5:'0x584', a6:'0x585',		
						a7:'0x586', a8:'0x587',
						b1:'0x588', b2:'0x589', b3:'0x58A',
						b4:'0x58B', b5:'0x58C', b6:'0x58D',		
						b7:'0x58E', b8:'0x58F'
					};
var R_D_C_CamAddr = { 	a1:'0x590', a2:'0x591', a3:'0x592',
						a4:'0x593', a5:'0x594', a6:'0x595',		
						a7:'0x596', a8:'0x597',
						b1:'0x598', b2:'0x599', b3:'0x59A',
						b4:'0x59B', b5:'0x59C', b6:'0x59D',		
						b7:'0x59E', b8:'0x59F'
					};
var R_L_S_CamAddr = { 	a1:'0x5A0', a2:'0x5A1', a3:'0x5A2',
						a4:'0x5A3', a5:'0x5A4', a6:'0x5A5',		
						a7:'0x5A6', a8:'0x5A7',
						b1:'0x5A8', b2:'0x5A9', b3:'0x5AA',
						b4:'0x5AB', b5:'0x5AC', b6:'0x5AD',		
						b7:'0x5AE', b8:'0x5AF'
					};	
var R_L_C_CamAddr = { 	a1:'0x5B0', a2:'0x5B1', a3:'0x5B2',
						a4:'0x5B3', a5:'0x5B4', a6:'0x5B5',		
						a7:'0x5B6', a8:'0x5B7',
						b1:'0x5B8', b2:'0x5B9', b3:'0x5BA',
						b4:'0x5BB', b5:'0x5BC', b6:'0x5BD',		
						b7:'0x5BE', b8:'0x5BF'
					};	
/* Camera RGB Address ( a1 ~ a8, b1 ~ b8 ) Bottom */

/* Camera RGB Data ( a1 ~ a8, b1 ~ b8 ) TOP*/						
var B_D_S_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};	
var B_D_C_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};			
var B_L_S_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};			
var B_L_C_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0,b8:0
					};			
var G_D_S_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};			
var G_D_C_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};	
var G_L_S_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};	
var G_L_C_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};
var R_D_S_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};		
var R_D_C_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};	
var R_L_S_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};	
var R_L_C_CamVal =	{	a1:0, a2:0, a3:0,
						a4:0, a5:0, a6:0,		
						a7:0, a8:0,
						b1:0, b2:0, b3:0,
						b4:0, b5:0, b6:0,		
						b7:0, b8:0
					};
/* Camera RGB Data ( a1 ~ a8, b1 ~ b8 ) Bottom*/						
					
// Camaddr
var Camaddr = 	{ 	
					B_D_S: B_D_S_CamAddr, 
					B_D_C: B_D_C_CamAddr,
					B_L_S: B_L_S_CamAddr,
					B_L_C: B_L_C_CamAddr,
					G_D_S: G_D_S_CamAddr,
					G_D_C: G_D_C_CamAddr,
					G_L_S: G_L_S_CamAddr,
					G_L_C: G_L_C_CamAddr,
					R_D_S: R_D_S_CamAddr,
					R_D_C: R_D_C_CamAddr,
					R_L_S: R_L_S_CamAddr,
					R_L_C: R_L_C_CamAddr
				};					
				
var Camaddr_val = { 
					B_D_S: B_D_S_CamVal, 
					B_D_C: B_D_C_CamVal,    
					B_L_S: B_L_S_CamVal,
					B_L_C: B_L_C_CamVal,
					G_D_S: G_D_S_CamVal,
					G_D_C: G_D_C_CamVal,
					G_L_S: G_L_S_CamVal,
					G_L_C: G_L_C_CamVal,
					R_D_S: R_D_S_CamVal,
					R_D_C: R_D_C_CamVal,
					R_L_S: R_L_S_CamVal,
					R_L_C: R_L_C_CamVal	
				};

var ID_Camaddr =	{
						a1:'#Adv_camera_tx_a1', a2:'#Adv_camera_tx_a2', a3:'#Adv_camera_tx_a3',
						a4:'#Adv_camera_tx_a4', a5:'#Adv_camera_tx_a5', a6:'#Adv_camera_tx_a6',		
						a7:'#Adv_camera_tx_a7', a8:'#Adv_camera_tx_a8',
						b1:'#Adv_camera_tx_b1', b2:'#Adv_camera_tx_b2', b3:'#Adv_camera_tx_b3',
						b4:'#Adv_camera_tx_b4', b5:'#Adv_camera_tx_b5', b6:'#Adv_camera_tx_b6',		
						b7:'#Adv_camera_tx_b7', b8:'#Adv_camera_tx_b8'
					};
					
var rgb_transmit_text	= 	{	
								B_D_S:'Blue Dark Spot Camera Allocation Information',
								B_D_C:'Blue Dark Color Camera Allocation Information',
								B_L_S:'Blue Light Spot Camera Allocation Information',
								B_L_C:'Blue Light Color Camera Allocation Information',
								G_D_S:'Green Dark Spot Camera Allocation Information',
								G_D_C:'Green Dark Color Camera Allocation Information',
								G_L_S:'Green Light Spot Camera Allocation Information',
								G_L_C:'Green Light Color Camera Allocation Information',
								R_D_S:'Red Dark Spot Camera Allocation Information',
								R_D_C:'Red Dark Color Camera Allocation Information',
								R_L_S:'Red Light Spot Camera Allocation Information',
								R_L_C:'Red Light Color Camera Allocation Information'
							};													

/* Ejecting ID, Address, Value Top */ 
var adv_ejecting_id;	// adv dialog ejecting 

// Ejecting Address define
var ejecting_addr = {
						delay_val_1: '0x467', delay_val_2: '0x468', delay_val_3: '0x469',
						head_val_1: '0x601', head_val_2: '0x602', head_val_3: '0x603', 
						hold_val_1: '0x604', hold_val_2: '0x605', hold_val_3: '0x606'
					};

// Ejecting Value define
var ejecting_val = 	{
						delay_val_1: 54, delay_val_2: 54, delay_val_3: 54,
						head_val_1: 30, head_val_2: 30, head_val_3: 30,
						hold_val_1: 60, hold_val_2: 60, hold_val_3: 60
					};

var ID_Ejecting_val = 	{
							delay_val_1:"#delay_val_1", delay_val_2:"#delay_val_2", delay_val_3:"#delay_val_3",
							head_val_1:"#head_val_1", head_val_2:"#head_val_2", head_val_3:"#head_val_3",
							hold_val_1:"#hold_val_1", hold_val_2:"#hold_val_2", hold_val_3:"#hold_val_3"
						};
/* Ejecting ID, Address, Value Bottom */

/* 
* Cleaning Object 
* Auto : 0x01(enable, default) / 0x00(disable)
* Cycle: 1 ~ 255 (init.: 60)
* Manual: 0x00(off, default) / 0x01(on)		
*/
var cleaning_addr = { 	Auto:'0x101', Cycle:'0x102', Manual:'0x103' };
var cleaning_val = { 	Auto: 1, Cycle: 60, Manual: 0 };
var ID_cleaning_val = { Auto:"#Auto", Cycle:"#Cycle", Manual:"#Manual" };

/* Lighting Object init start*/
var light_timer;
var lighting_addr = { 
						light_on_a1:'0x300', light_on_a2:'0x301', light_on_a3:'0x302',
						light_on_b1:'0x303', light_on_b2:'0x304', light_on_b3:'0x305',
						light_val_a1:'0x309', light_val_a2:'0x30A', light_val_a3:'0x30B', 
						light_val_b1:'0x30C', light_val_b2:'0x30D', light_val_b3:'0x30E' 
						
					};
var lighting_val = 	{
						light_on_a1:255, light_on_a2:255, light_on_a3:255,
						light_on_b1:255, light_on_b2:255, light_on_b3:255,
						light_val_a1:100, light_val_a2:100, light_val_a3:100, 
						light_val_b1:100, light_val_b2:100, light_val_b3:100
					};
var ID_lighting_val = 	{
							light_on_a1:'#light_on_a1', light_on_a2:'#light_on_a2', 
							light_on_a3:'#light_on_a3',	light_on_b1:'#light_on_b1', 
							light_on_b2:'#light_on_b2', light_on_b3:'#light_on_b3',
							light_val_a1:'#light_val_a1', light_val_a2:'#light_val_a2', 
							light_val_a3:'#light_val_a3', light_val_b1:'#light_val_b1', 
							light_val_b2:'#light_val_b2', light_val_b3:'#light_val_b3' 
						};
/* Lighting Object init end */

/* Camera Object init start */
var camera_onoff_addr = { 
							rgb_A: '0x402', rgb_B: '0x403' 
						};
var camera_onoff_val =  {
							rgb_A: 255, rgb_B: 255
						};
var ID_camera_onoff_val = 	{
								camera_step:'#camera_step_a1' ,camera_onoff:'#camera_a1'
							};
/* Camera Object init end */

/* Model Object init start */
var model_addr = 	{
						nir:'0x002', stage:'0x002', channel:'0x002', rgb_a:'0x400', rgb_b:'0x401'
					};
var model_val = 	{
						nir:0, stage:0,	channel:0, rgb_a:'0x400', rgb_b:'0x401'
					};
var ID_model_val = 	{
						nir:'#md-nir', stage:'#md-stage',
						channel: '#check-channel', rgb_a:'#rgb-a', rgb_b:'#rgb-b'
					};
/* Model Object init end */

var rgb_addr;
var rgb_val;

var airgun_addr;
var airgun_val;

var rgb_addr_A = { part:'0x446', chute:'0x446'};
var rgb_addr_B = { part:'0x447', chute:'0x447'};

// chute 1~128
var rgb_val_A = { part:'A', chute:1, html_chute:1 };
var rgb_val_B = { part:'B', chute:1, html_chute:1 };
var ID_rgb_val = {  part:"#part", chute:"#chute_list" };

var airgun_addr_A = { channel:'0x448' };
var airgun_addr_B = { channel:'0x448' };
var airgun_val_A =	{
						'1':1, '2':1, '3':1, 
						'4':1, '5':1, '6':1,
						past_1:1, past_2:1, past_3:1, past_4:1, past_5:1, past_6:1
					};
var airgun_val_B =	{
						'1':1, '2':1, '3':1, 
						'4':1, '5':1, '6':1,
						past_1:1, past_2:1, past_3:1, past_4:1, past_5:1, past_6:1
					};
var ID_airgun_val = { channel:"#channel_val" };

// airgun_channel number 1 ~ 6
var ch_num1=new Array();
var ch_num2=new Array();
var ch_num3=new Array();
var ch_num4=new Array();
var ch_num5=new Array();
var ch_num6=new Array();

var marking;
var marking_ch_num = 	{
							'1':ch_num1, '2':ch_num2, 
							'3':ch_num3, '4':ch_num4, 
							'5':ch_num5, '6':ch_num6
						};


var comp_stop_flag = 0, image_recv_comp_flag = 0;
var fix_flag = 0, fix_timer, fix_timer_cnt = 0;

var rgb_type_flags = {
	rgb_r:0, rgb_g:1, rgb_b:2, rgb: 3
};
var rgb_type_flag = rgb_type_flags.rgb;

var video_addr;		// video_addr_A, B
var video_val;		// video_val_A, B
var video_dlg_open_flag = 0;	// 0:close, 1:open

var video_addr_A 	= 	{
							type: '0', part:'0x429', component:'0x429', 
							gain:'0x443', form:'0x43D', fix:'0x42C'
						};
var video_addr_B 	= 	{
							type: '0', part:'0x42A', component:'0x42A', 
							gain:'0x444', form:'0x43E', fix:'0x42D'
						};
				
// component : data 1(0000 0001b)~128(1000 000b)
// form: data(1-bit): 0b(corr., default) / 1b(raw)
var video_val_A 	= 	{
							type:0, part:'a', component:0, gain:1, 
							form:0, html_component: 0, fix:1
						};
var video_val_B 	= 	{
							type:0, part:'b', component:0, gain:1,
							form:0, html_component: 0, fix:1
						};							
						

var ID_video_val 	= 	{
							type: '#type', part:'#part', gain: '#gain', 
							component: '#component_val'
						};

var back_front_addr = 	{ bg_f_h:'0x10B', bg_f_l:'0x10C' }; 
var back_rear_addr = 	{ bg_r_h:'0x109', bg_r_l:'0x10A' };	
		
var back_front_val = 	{ bg_f_h:0, bg_f_l:0, html_val:512 }; 
var back_rear_val = 	{ bg_r_h:0, bg_r_l:0, html_val:512 };						
						
var ID_back_front_val = { bg_f_h:'#bg_f_val', bg_f_l:'#bg_f_val'};
var ID_back_rear_val = { bg_r_h:'#bg_r_val', bg_r_l:'#bg_r_val' };
				
// Device_value_1 ~ 3, Dialog Feed value, Eject and Feed On Off value for Init
var device_objects 	=	{ 
							mode_val: mode_val, device_val_1: device_val_1, device_val_2: device_val_2, device_val_3: device_val_3,
							adv_feed_val: adv_feed_val, B_D_S_CamVal: B_D_S_CamVal, 
							B_D_C_CamVal: B_D_C_CamVal, B_L_S_CamVal: B_L_S_CamVal,
							B_L_C_CamVal: B_L_C_CamVal,	G_D_S_CamVal: G_D_S_CamVal,
							G_D_C_CamVal: G_D_C_CamVal,	G_L_S_CamVal: G_L_S_CamVal,
							G_L_C_CamVal: G_L_C_CamVal,	R_D_S_CamVal: R_D_S_CamVal,
							R_D_C_CamVal: R_D_C_CamVal,	R_L_S_CamVal: R_L_S_CamVal,
							R_L_C_CamVal: R_L_C_CamVal,	Eject_Feed_onoff_val: Eject_Feed_onoff_val, 
							ejecting_val: ejecting_val, cleaning_val:cleaning_val, lighting_val:lighting_val, 
							camera_onoff_val:camera_onoff_val, model_val: model_val, 
							back_front_val: back_front_val, back_rear_val: back_rear_val,
							mode_name_val: mode_name_val
						};
var device_object_val;
	
var device_addr_AckNack;	// AckNack Html ID Address	

//	Device AckNack Address ID Store function
function AckNack_Addr_Store( device_addr_id ) {
	$(device_addr_id).val("Send");
	$(device_addr_id).css("background", "#FFFF00");
	device_addr_AckNack = device_addr_id;	// AckNack Address ID	
}

function isleapYear(year) {
	
	if( year%4==0 && ( year%100!=0 || year%400==0 ) ) {
		console.log('leapYear true');
		return true;
	} else {
		console.log('leapYear false');
		return false;
	}
}

// Timer Function
function startTime() {

	var now = new Date();
	var year= now.getFullYear();
	var mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
	var day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
	
	var h=now.getHours();		// UTC + 9 hours == korea time
	var m=now.getMinutes();
	var s=now.getSeconds();
	m = checkTime(m);
	s = checkTime(s);
	var ampm;
	if( h >= 12 ) ampm = 'P';
	else ampm = 'A';
	
	// var time_str = year + '-' + mon + '-' + day+' '+h + ':' + m + ':' + s +' '+ampm;
	var time_str = day + '-' + mon + '-' + year +' '+h + ':' + m + ':' + s +' '+ampm;
	var t = setTimeout(function(){startTime()},500)
	
	$("#date").val(time_str);	// Time Display
}

// Check TIme Function ( i<10? 'i'+'0' ) Display 
function checkTime(i) {
	if (i<10) {i = "0" + i};  // add zero in front of numbers < 10
	return i;
} 

// Main Diglog ID 
var Dlg_id = 	[	
					'Feed_Dlg', 'Defect_Dlg', 'Defect_Pxl_Dlg', 'RGB_Dlg', 
					'Ejecting_Control_Dlg', 'Cleaning_Dlg', 'Camera_Adv_Dlg', 
					'Ejecting_Control_Dlg',	'system_dlg', 'Lighting_Dlg', 
					'Camera_Onoff_Dlg', 'password_dlg', 'pass_input_dlg', 
					'Model_Dlg', 'airgun_dlg', 'video_dlg'
				];	
var vd_Dlg_id = [ 'dv_bg_f_dlg', 'dv_bg_r_dlg' ];

// Main All Dialog Close Function					
function Vd_Dialog_Close() {		
	// console.log('vd_Dlg_id.length:'+vd_Dlg_id.length);
	
	for( var i=0; i<vd_Dlg_id.length; i++) {
		
		if( $("#"+vd_Dlg_id[i]).dialog("isOpen") == true) {
			$("#"+vd_Dlg_id[i]).dialog("close");
		}
	}
}

// Main All Dialog Close Function					
function All_Dialog_Close() {		
	// console.log('Dlg_id.length:'+Dlg_id.length);
	
	for( var i=0; i<Dlg_id.length; i++) {
		
		if( $("#"+Dlg_id[i]).dialog("isOpen") == true) {
			$("#"+Dlg_id[i]).dialog("close");
		}
	}
}

function operator_enableElements() {
	
	for(var key in ID_device_addr_1) {
		document.getElementById(ID_device_addr_1[key].slice(1)).disabled=false;
	}
	$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode disable
	document.getElementById("eject").disabled=false;	
	document.getElementById("feed").disabled=false;
	
	$( "#menu_4" ).menu( "option", "disabled", false );
	
	document.getElementById("help").disabled=true;
	document.getElementById("step-1st").disabled=false;
	document.getElementById("step-2nd").disabled=false;
	document.getElementById("step-3rd").disabled=false;
	
}

function enableElements() {
	
	for(var key in ID_device_addr_1) {
		document.getElementById(ID_device_addr_1[key].slice(1)).disabled=false;
	}
	$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode disable
	document.getElementById("eject").disabled=false;	
	document.getElementById("feed").disabled=false;
	
	// document.getElementById("help").disabled=false;	
	$( "#menu_3" ).menu( "option", "disabled", false );
	$( "#menu_4" ).menu( "option", "disabled", false );
	
	document.getElementById("help").disabled=false;
	document.getElementById("step-1st").disabled=false;
	document.getElementById("step-2nd").disabled=false;
	document.getElementById("step-3rd").disabled=false;
	
}

function disableElements() {
	for(var key in ID_device_addr_1) {
		document.getElementById(ID_device_addr_1[key].slice(1)).disabled=true;
	}
	
	document.getElementById("eject").disabled=true;	
	document.getElementById("feed").disabled=true;	
	
	$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable	
	$( "#menu_3" ).menu( "option", "disabled", true );
	
	document.getElementById("help").disabled=true;
	document.getElementById("step-1st").disabled=true;
	document.getElementById("step-2nd").disabled=true;
	document.getElementById("step-3rd").disabled=true;
}

function validate_input_check() {
	
	var check_time_val = $("#date").val();
	var current_year = check_time_val.slice(0,4);
	var current_month = check_time_val.slice(5,7);
	var current_day = check_time_val.slice(8,10);
	
	// start year == stop year 
	if ( validate_start_val.year == validate_stop_val.year ) {
		
		if (  validate_start_val.month > validate_stop_val.month  ) {
			return false;
			validate_error_id ="#stop_date";
		}
		else if ( validate_start_val.month == validate_stop_val.month ) {
			if( validate_start_val.day > validate_stop_val.day ) {
				return false;
				validate_error_id ="#stop_date";
			} else if( validate_start_val.day == validate_stop_val.day ){
				return false;
				validate_error_id ="#stop_date";
			} else {
				return true;
			}
		}
		else{ 
			return true;
		}
	}
	else if( validate_start_val.year > validate_stop_val.year ) {
		return false;
		validate_error_id ="#stop_date";
	} 
	else {
		return true;
	}

	delete check_time_val;
	delete current_year;
	delete current_month;
	delete current_day;
 
}

function validate_check_program() {
	
	var check_time_val = $("#date").val();
	
	var current_day = parseInt(check_time_val.slice(0,2));
	var current_month = parseInt(check_time_val.slice(3,5));
	var current_year = parseInt(check_time_val.slice(6,10));
		
	// debug
	/*
	console.log('current_year: '+current_year
									+', current_month: '+current_month
									+', current_day: '+current_day);
	*/
	
	// debug
	/*
	console.log( 'date_vals.check_step:' + date_vals.check_step );
	console.log( 'date_vals.check_step:' + date_vals['stop_'+(date_vals.check_step+1)] );
	*/
	
	if( current_year <= '1970' ) {
		validate_flag = false;	// modify 0128
		// console.log('break point 1');
	} else {
		validate_flag = true;	
		for(var key in date_onoff_vals) {
				
			if( date_vals[key] == '-' ) {

				console.log("Not Setting");
				valid_flag[key] = true;	
				
			} else if( date_onoff_vals[key] != 0 ) {
				
				var valid_year = parseInt(date_vals[key].slice(6)),
				valid_month = parseInt(date_vals[key].slice(3,5)),
				valid_day = parseInt(date_vals[key].slice(0,2));
				
				// debug
				/*
				console.log('valid_year: '+ valid_year
					+' valid_month: '+ valid_month
					+' valid_day: '+ valid_day);				
				*/
				// stop year == current year
				if ( valid_year == current_year ) { 
			
					if ( valid_month < current_month  ) {
					
						valid_flag[key] = false;
						// console.log('break point 4');
						// console.log('valid_month < current_month');
					
					} else if ( valid_month == current_month ) {
						
						if( valid_day < current_day ) {
							
							// 'valid_day < current_day'
							valid_flag[key] = false;
							// console.log('break point 5');
							// console.log('valid_day < current_day');
						
						} else if( valid_day > current_day ){
								
							// 'valid_day > current_day'
							valid_flag[key] = true;
							// console.log('valid_day > current_day');
						} else {	
						
							// 'valid_day == current_day'
							valid_flag[key] = true;
							// console.log('valid_day == current_day');
						}
						
					} else {
					
						// valid_month > current_month
						valid_flag[key] = true;
						// console.log('valid_month > current_month');
					}
					
				} else if( valid_year < current_year ) {
					// valid_year < current_year
					valid_flag[key] = false;
					// console.log('break point 6');
				} else if( valid_year > current_year ) {
					
					if( current_year <= '1970' ) {
						valid_flag[key] = false;
						// console.log('break point 7');
					} else {
						valid_flag[key] = true;
					}
					
				} else {
					valid_flag[key] = true;
				}
			}
		}	// end of for
	}
	
	for(var key in valid_flag) {
		if( date_onoff_vals[key] != 0 ) {
			if ( valid_flag[key] != true ) {
				validate_flag = false;
			}
		}
	}
}

$(document).ready( function() {
		
	/*
	// device check
	var device = check_device();
	if(device !=''){
		alert(device);
	}
	*/
	
	// Not Drag
	document.oncontextmenu = function(){ return false; }
	document.onselectstart = function(){ return false; }
	document.ondragstart = function(){ return false; }
	
	fun();
	
});

function fun()
{		
	
	startTime();	// Timer Function
	
	var socket;		// socket.io socket
	
	// shutdown states
	var shutdown_states = { feed_off:0, eject_off:1, cleaning_on:2, cleaning_off:3, system_off:4 };
	var shutdown_state = shutdown_states.feed_off;
	
	// modechange_states
	var modechange_states = { cleaning_on:1, cleaning_off:2, all_save:3 };
	var modechange_state = modechange_states.cleaning_on;
	
	$('.main_menu').on('mousedown', function() {
		console.log('html body click');
		console.log('current_account :'+current_account);
				
		if ( $("#date").val().slice(6,10) != '1970' ) {
			
			if ( validate_flag != true ) {
				if ( current_account == accounts.operator ) {
					$("#pass_input_dlg").dialog({ title: 'Program Password'});
					$('#pass_input_lab').html('Validate Password : ');
					pass_match_process = pass_match_processes.validate_unlock;
					$(pass_input_dlg).dialog("open");
					disableElements();
				}
			}
			
		}
		
	});
	
	$(window).on('keyup', function(event){
		if(event.keyCode == '9'){
			
			// console.log('event.keyCode: ' + event.keyCode);
			
			//getFocused(event);
			$("#getfocus").focus().select(); 
		} else if( event.keyCode == '13' ) {
			console.log('event.keyCode: ' + event.keyCode);
		}
		
		//$('#pass_input').val();
		
		/*
		$("#pass_input").focus( function(){
			$("#pass_input").attr('type','text');
		});
		$("#pass_input").blur( function(){
			("#pass_input").attr('type','password');	
		});
		*/
		/*
		setTimeout( function() {
			$("#pass_input").attr('type','password');	
		}, 500);
		*/
		
	});

	/*
	var focused = 0;
	function getFocused(e){
	var ida =  $(':focus').eq(0).prop('id');
		if(ida=='detect' && focused==0){
			focused = 1;
			console.log(e);
		}
	}
	*/
	
	/* Server Connect ( Web => Node(server) ) */
	socket = io.connect("http://localhost:3000");
	
	// Connect Event
	socket.on('connect', function(){
	
		// console.log('The successful connection');
		
		// socket.emit('mode_name_read');	// mode name read request web -> server
		
		// 0113 modify
		socket.emit('validate_onoff_check');	// validate read request web -> server
		
		socket.emit('validate_read');	// validate read request web -> server
		
		setTimeout(Read_All_AVR_M_Data, 800);	// Read avr data
		progressTimer = setInterval( progress, 90);	// progress Timer set
		
		// modify 0114
		// err_check_timer init
		err_check_timer = setInterval( error_check_func, 1000);
		
	});	
	
	socket.on('program_close', function() {
		console.log('program close event');
		
		self.opener = self;
		window.opener = window.location.href;
		window.open('about:blank', '_self').close();
		window.close();
		self.close();	// browser exit
	});
	
	socket.emit('user_name_req');
	socket.on('user_name_init' , function(data) {
		console.log('user name : ' + data.name ); 
		user.name = data.name;
		$("#username").val(user.name);
		$("#user_name_input").val(user.name);
	});
	
	socket.on('program_init_check', function(data) {
		program_init_flag = data;
	});
	 
	// password check response: server -> html
	socket.on('pass_check_res', function(data) {
		console.log('pass_check_res :'+ data.state+','+ data.flag);
		
		switch( pass_match_process ) {
			
			case pass_match_processes.date_time: 
					if ( data.flag == '1' ) {	   // match ok
						$(date_config_dlg).dialog("open");	
					} else {	// not match
						$("#alert_content").html('Passwords do not match.');
						$(message_alert_dlg).dialog("open");
					}
					break;
					
			case pass_match_processes.validate: 
			
					if ( data.flag == '1' ) {	// match ok
						$(validate_dlg).dialog("open");	
					} else {	// not match
						$("#alert_content").html('Passwords do not match.');
						$(message_alert_dlg).dialog("open");
					}
					break;
												
			case pass_match_processes.validate_unlock: 	
			
					if ( data.flag == '1' ) {	// match ok
					
						enableElements();
						console.log('password match ok!!');
						
					} else {	// not match
						
						$("#alert_content").html("Passwords do not match");
						$(message_alert_dlg).dialog("open");
						
					}
					break;
			
			case pass_match_processes.account:	
							
					if ( data.flag == '1' ) {	// match ok
													
						switch(account_id.select) {
	
							case 'admin':	
								account_id.current = account_id.select;
								
								$("#account_menu_title").html( 'Admin' );
								
								enableElements();
								break;
							
							case 'engineer':	
								account_id.current = account_id.select;
								$("#account_menu_title").html( $("#engineer").html());
								
								$( "#menu_3" ).menu( "option", "disabled", false );	// menu enable
								document.getElementById("help").disabled=false;		// help btn enable
								enableElements();
								break;
						
							default: break;
							
						}
						
						account_id.past_id = account_id.current;
						
						$("#alert_content").html("Confirm Password");
						$(message_alert_dlg).dialog("open");
						
					} else {
						
						current_account = current_account[account_id.past_id];
						$("#account_menu_title").html( $( "#"+account_id['past_id'] ).html());
						$("#alert_content").html("Passwords do not match.");
						$(message_alert_dlg).dialog("open");
						
					}
					break;
							
			default : break;
		}
		
	});
	
	socket.on('password_init_res', function(data) {
		
		console.log( 'Account state : '+data.account );
		console.log( 'Password init flag : '+data.iFlag );
		
		if( data.iFlag == true ) {
			
			console.log( 'data.iFlag == true' );
			
			switch(data.account.toString()) {
				
				case accounts.admin:
				
							console.log('accounts.admin');
							$("#alert_content").html("Successful password reset");
							$(message_alert_dlg).dialog("open");
							break;
				
				case accounts.engineer:
				
							console.log('accounts.engineer');
							$("#alert_content").html("Successful password reset");
							$(message_alert_dlg).dialog("open");
							break;
				
				default: break;
				
			}
			
		} else {
			$("#alert_content").html("Password initialization failed");
			$(message_alert_dlg).dialog("open");
		}
		
	});
	
	// password change response: server -> html
	socket.on('pass_change_res', function(data) {
		
		$("#pass_old").focus().select();
		console.log('pass_change_res: '+data.state+','+data.ack_flag);
		
		if ( data.ack_flag != '1' ) {
			console.log('password store failed');
			$("#alert_content").html('The password change failed. </br>&nbsp : Old Password do not match');
		} else {
			console.log('password store success');
			$("#alert_content").html('Successful password change.');
		}
		
		$(message_alert_dlg).dialog("open");
	
	});
	
	// password init state response: server -> html
	socket.on('pass_val_res', function(data) {
		server_pass_info.state = data.state;
		server_pass_info.ack_flag = data.ack_flag;
	});
	
	// mode name response
	socket.on('mode_name_res', function(data){
		console.log('mode_name_res event data: '+data);
		var mode_name = new Array(8);
		mode_name = data.split(':');
		var i=0;
		
		for(key in mode_names) {
			mode_names[key] = mode_name[i];
			$("#mode_"+(i+1)).html(mode_names[key]);
			i++;
		}
	});
	
	// Socket_emit Function
	function socket_vd_emit(ID, Command, address, value) {
		
		// console.log('socket_emit func');
		var data_length = address.length + value.length;
		
		// ID : Command :: data length ::: address+data ::::
		socket.emit('data_ev_vd', { message :STX + ':' + ID 
			+ ':' + Command	+ ':' + data_length + ':' 
			+ ( address + value )		
		});
			
		// debug // console.log(STX + ':' + ID + ':' + Command	+ ':' + data_length + ':' 	+ address + ':' + value + ':');	
						
	}
	
	// Socket_emit Function
	function socket_emit(ID, Command, address, value) {
		
		//console.log('socket_emit func');
		var data_length = address.length + value.length;
		
		// ID : Command :: data length ::: address+data ::::
		socket.emit('data_ev', { message :STX + ':' + ID 
			+ ':' + Command	+ ':' + data_length + ':' 
			+ ( address + value ), mode: mode_val.mode
		});
		nack_addr = address;
		nack_value = value;
		
		// debug // console.log(STX + ':' + ID + ':' + Command	+ ':' + data_length + ':' + address + ':' + value + ':');	
	}
	
	// Error Check Function 
	function error_check_func() {
	
		var cmd = '5';
		var addr = '0x000';
		var val = '0';	// must be toString()
		// console.log('err check emit!');
		
		if( video_dlg_open_flag != 1 ) {
			socket_emit(ID, cmd, addr, val);
		} else {
			socket_vd_emit(ID, cmd, addr, val);
		}
	}
	
	// feed vibration value, feed state command function
	function feed_condition_check() {
		var cmd = 'f';
		var addr = '0x000';
		var val = '0';	// must be toString()
		socket_emit(ID, cmd, addr, val);
		// console.log('feed_condition_check emit!');
	}
	
	// cleaning on off function
	function cleaning_maual_onoff( on_off_val ) {
		
		//console.log('cleaning_maual_onoff value 0=off, 1=on ::' + on_off_val);
		// cleaning on
		cleaning_val.Manual = on_off_val;
		Command = '1';
		address = cleaning_addr.Manual;			// cleaning Manual addrss
		value = cleaning_val.Manual.toString();	// must be toString()
		socket_emit(ID, Command, address, value);
	
	}
	
	
	function mode_ena_disable_check() {		
		// Eject, Feed enable disable
		if ( ( Eject_Feed_onoff_val.EjectOnOff == 0 ) && ( Eject_Feed_onoff_val.FeedOnOff == 0 ) ){
			$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode enable	
		} else {
			$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable	
		}
	
	}
	
	// feed off function
	function feed_on_off(feed_flag) {
		// Feed off
		Eject_Feed_onoff_val.FeedOnOff = 0;				
		$("#feed").css("background", "#6DCBB0");						
		$("#feed").html("FEED OFF");
		Command = '4';	
		address =  Eject_Feed_onoff_addr.FeedOnOff;	// Address store	
		value = '0';  		// must be "toString()"
		socket_emit(ID, Command, address, value);
	}
	
	// eject off function
	function eject_on_off(eject_flag) {
		
		Eject_Feed_onoff_val.EjectOnOff = eject_flag;				
		$("#eject").css("background", "#6DCBB0");
		$("#eject").html("EJECT OFF");

		Command = '4';
		address =  Eject_Feed_onoff_addr.EjectOnOff;
		value = eject_flag.toString();
		socket_emit(ID, Command, address, value);
	
	}
	
	// gain all save function
	function all_save_func() {
			
		// $("#mode_init_all_save").html("Gain Save : ").append(document.createTextNode( "OK!!" ));
	
		// gain value emit start
		var address = '0x443';	// video_addr_A.gain
		var gain_a = 255;
		var value = gain_a.toString();
		Command = '1';
		socket_emit(ID, Command, address, value);
		// gain value emit end
		
		// gain value emit start
		address = '0x444';	// video_addr_B.gain;
		var gain_b = 255;
		value = gain_b.toString();
		Command = '1';
		socket_emit(ID, Command, address, value);
		// gain value emit end
		
	}
	
	// modechange function: 
	// cleaning on -> delay 5s -> cleaning off -> gain all_save
	function modechange_func() {
		
		switch( modechange_state ) {
												
			case modechange_states.cleaning_off:	cleaning_maual_onoff(0); 
													modechange_state = modechange_states.all_save;
													$("#mode_init_clean_off").html("Cleaning Off : ").append(document.createTextNode( "OK!!" ));
													break;
			case modechange_states.all_save:	all_save_func();
												modechange_state = modechange_states.cleaning_off;
												
												clearInterval(mode_timer);
												$("#mode_init_dlg").dialog("close");
												
												$("#mode_init_clean_on").html("Cleaning On");
												$("#mode_init_clean_off").html("Cleaning Off");

												Read_All_AVR_M_Data();	// Read avr data
												
												
												break;
			default : 	//console.log('unknown state'); 
						break;									
		}
	}
	
	function shutdown_func() {
		
		$("#check-shutdown input[id=shutdown-3]").prop("checked", true);
		$('#check-shutdown').buttonset("refresh");
				
		// System off
		Command = '1';
		address = system_onoff_addr;
		value = system_onoff_val_off.toString();
		socket_emit(ID, Command, address, value);
		$( System_Dlg ).dialog( "close" );
		
		clearInterval(shutdown_timer);
	}
	
	function system_off_func() {
		
		switch( shutdown_state ) {
			case shutdown_states.feed_off: 	// Eject off
											Eject_Feed_onoff_val.EjectOnOff = 0;				
											$("#eject").css("background", "#6DCBB0");
											$("#eject").html("EJECT OFF");
											
											Command = '4';
											address =  Eject_Feed_onoff_addr.EjectOnOff;
											value = '0';
											socket_emit(ID, Command, address, value);
											$("#check-shutdown input[id=shutdown-0]").prop("checked", true);
											$('#check-shutdown').buttonset("refresh");			
											
											shutdown_state = shutdown_states.eject_off;
											break;
											
			case shutdown_states.eject_off:	// Feed off
											Eject_Feed_onoff_val.FeedOnOff = 0;				
											$("#feed").css("background", "#6DCBB0");						
											$("#feed").html("FEED OFF");
											Command = '4';	
											address =  Eject_Feed_onoff_addr.FeedOnOff;	// Address store	
											value = '0';  		// must be "toString()"
											socket_emit(ID, Command, address, value);
											
											$("#check-shutdown input[id=shutdown-1]").prop("checked", true);
											$('#check-shutdown').buttonset("refresh");	
											
											shutdown_state = shutdown_states.cleaning_on;
											//shutdown_state = shutdown_states.system_off;
											break;
											
			case shutdown_states.cleaning_on:	// cleaning on:1, off:0
												clearInterval(shutdown_timer);	
												cleaning_maual_onoff(1);
												shutdown_timer = setInterval(system_off_func, 5000);
												$("#check-shutdown input[id=shutdown-2]").prop("checked", true);
												$('#check-shutdown').buttonset("refresh");
												
												shutdown_state = shutdown_states.cleaning_off;
												break;
											
			case shutdown_states.cleaning_off:	// cleaning on:1, off:0
												clearInterval(shutdown_timer);
												cleaning_maual_onoff(0);
												shutdown_timer = setInterval( system_off_func, 5500 );
											
												shutdown_state = shutdown_states.system_off;
												break;
												
			case shutdown_states.system_off:	shutdown_func(); 
												shutdown_state = shutdown_states.feed_off;
												break;
												
			default : 	//console.log('unknown state'); 
						break;									
		}
	}
	
	// 1st, 2nd, 3rd button
	$(".step_btn").css("background", "#6DCBB0")
	.css("color", "black")
	.css("font-size", 30)
	.css("font-weight", "bold")
	.css("width", 208)
	.css("height", 60);
	
	// Dialog Slider Set
	$( "#Feed_Dlg_slider" ).slider({	range: "min", value: 30,  min: 0,  max: 100 }).width(360).height(30);
	$( "#Defect_Dlg_slider" ).slider({	range: "min", value: 1,  min: 1,  max: 4 }).width(360).height(30);
	$( "#Defect_Pxl_Dlg_slider" ).slider({	range: "min", value: 1,  min: 1,  max: 4 }).width(360).height(30);
	$( "#RGB_Dlg_slider" ).slider({	range: "min", value: 100,  min: 0,  max: 200 }).width(360).height(30);
	
	// airgun dialog btn, wiget set
				
	// camera(RGB/NIR) air-gun(channel) select key-pad			
	$("#check").buttonset();
	
	// chute button setting
	$(".chute_button").button();
		
	$("#check-shutdown").buttonset();
	
	$( "#menu_3" ).menu({
		select: function( event, ui ) {
			console.log('menu select!');
		}
	}).width(183).height(55).css("text-align", "center").css("background", "#6DCBB0");
	
	$( "#menu_4" ).menu({
		select: function( event, ui ) {
			console.log('menu select!');
		}
	}).width(183).height(55).css("background", "#6DCBB0");
	
	$( "#menu_4" ).menu( "option", "position", { my: "left top+10", at: "left top+50" } );
	
	
	$( "#account_list_top_menu" ).menu().width(345).height(44).css("background", "#6DCBB0");
	$( "#account_list_top_menu" ).menu( "option", "position", { my: "left top", at: "left top+50" } );
	$("#account_list_top_menu").mouseleave(function () {
	   $("#account_list_top_menu").menu('collapseAll');
	});
	
	$( "#mode_list_top_menu" ).menu().width(345).height(43).css("background", "#6DCBB0");
	$( "#mode_list_top_menu" ).menu( "option", "position", { my: "left top", at: "left top+50" } );
	$("#mode_list_top_menu").mouseleave(function () {
	   $("#mode_list_top_menu").menu('collapseAll');
	});
	// Error Check Variable Start ==
	var err_code = 	{	
						cleaning:'1000', air:'0100', 
						chute:'0204'  
					};
					
	var normal_code = 'FFFF';
	var err_dlg_id = [ '#clean_err_dlg', '#air_err_dlg', '#chute_err_dlg' ];
	var err_video_flag = 0;
	var err_airdlg_open_flag = 0;
	var err_dlg_auto_close_flag = 0;
	var err_code_str = 'FFFF';
	
	function all_err_dlg_close() {
		for( var i=0; i<err_dlg_id.length; i++) {			
			if( $(err_dlg_id[i]).dialog("isOpen") == true) {
				$(err_dlg_id[i]).dialog("close");
			}	
		}
	}
	
	function dialog_open_check(dialog_id) {
		if( $(dialog_id).dialog("isOpen") == true ) {
			return 1;
		} else return -1;
	}
	
	var date_config_dlg = $("#date_config").dialog({
		
		//dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center center", at: "center center" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		open: function( event, ui ) {
			
			var now = new Date();
			var year= now.getFullYear();
			var mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
			var day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
			
			var hour=now.getHours();		// UTC + 9 hours == korea time
			var min=now.getMinutes();
			var sec=now.getSeconds();
			min = checkTime(min);
			sec = checkTime(sec);
			
			/*
			var check_time_val = $("#date").val();
	
			var day = parseInt(check_time_val.slice(0,2));
			var month = parseInt(check_time_val.slice(3,5));
			var year = parseInt(check_time_val.slice(6,10));
			var hour = parseInt(check_time_val.slice(11,13));
			var min = parseInt(check_time_val.slice(14,17));
			var sec = parseInt(check_time_val.slice(18,20));
			*/					
			$('#day_val').val(day);
			$('#month_val').val(mon);
			$('#year_val').val(year);
			$('#hour_val').val(hour);
			$('#min_val').val(min);
			$('#sec_val').val(sec);
			
			date_config_vals.year = year;
			date_config_vals.month = mon;
			date_config_vals.day = day;
			
			date_config_vals.hour = hour;
			date_config_vals.min = min;
			date_config_vals.sec = sec;
			
			date_config_vals.past_year = year;
			date_config_vals.past_month = mon;
			date_config_vals.past_day = day;
			
			date_config_vals.past_hour = hour;
			date_config_vals.past_min = min;
			date_config_vals.past_sec = sec;
		},
		close: function( event, ui ) {
		
		},
		closeOnEscape: false,
		closeText: null
	});
	
	$('#date').click(function() {
		if( current_account != accounts.operator ) {
			
			pass_match_process = pass_match_processes.date_time;
			
			switch( account_id.select ) {
				case 'admin' :
					$("#pass_input_dlg").dialog({ title: 'Date Configuration'});
					$('#pass_input_lab').html('Admin Password : ');
					break;
				
				case 'engineer':
					$("#pass_input_dlg").dialog({ title: 'Date Configuration'});
					$('#pass_input_lab').html('Engineer Password : ');
					break;
				
				default : break;
			}
			
			if( $(pass_input_dlg).dialog("isOpen") != true) {
				$(pass_input_dlg).dialog('open');
			}
			
		}	
	});
	
	function isleapYear(year) {
		
		if( year%4==0 && ( year%100!=0 || year%400==0 ) ) {
			console.log('leapYear true');
			return true;
		} else {
			console.log('leapYear false');
			return false;
		}
	}
	function date_and_time_check(val_id) {
			
		switch( val_id ) {
			case 'year':
					if( date_config_vals[val_id] < 0 ) {
						date_config_vals[val_id] = 0;
					}
					break;
			case 'month':
					if( date_config_vals[val_id] > 12 ) {
						date_config_vals[val_id] = 1;
					} else if( date_config_vals[val_id] < 1 ) {
						date_config_vals[val_id] = 12;
					}
					break;
			case 'day':
					if( date_config_vals[val_id] > 31 ) {
						date_config_vals[val_id] = 1;
					} else if( date_config_vals[val_id] < 1 ) {
						date_config_vals[val_id] = 31;
					}
					break;
			case 'hour':
					if( date_config_vals[val_id] > 23 ) {
						date_config_vals[val_id] = 0;
					} else if( date_config_vals[val_id] < 0 ) {
						date_config_vals[val_id] = 23;
					}
					break;
			case 'min':
					if( date_config_vals[val_id] > 60 ) {
						date_config_vals[val_id] = 0;
					} else if( date_config_vals[val_id] < 0 ) {
						date_config_vals[val_id] = 60;
					}
					break;
			case 'sec':
					if( date_config_vals[val_id] > 60 ) {
						date_config_vals[val_id] = 0;
					} else if( date_config_vals[val_id] < 0 ) {
						date_config_vals[val_id] = 60;
					}
					break;
			default : break;	
		}
	}
	
	function date_value_up_down(val_id) {
		
		var value_id = val_id.slice(0,val_id.indexOf("_"));
		var up_down_char = val_id.slice(-1);
		console.log('value_id : '+value_id +', up_down_char : '+up_down_char); 
		
		switch(up_down_char) {
			
			case 'u':
					date_config_vals[value_id]++;				
					break;
			
			case 'd':
					date_config_vals[value_id]--;
					break;
			
			default: break;				
		}
		date_and_time_check(value_id);
		date_time_str = 'sudo date -s \''+date_config_vals['year']+'-'+date_config_vals['month']
						+'-'+date_config_vals['day']+' '+date_config_vals['hour']
						+':'+date_config_vals['min']+':'+date_config_vals['sec']+'\'';
		$('#'+value_id+'_val').val(date_config_vals[value_id]);
	}
	
	$('.date_bt').on('mouseup', function() {
		clearInterval(timer);
	});
	
	$('.date_bt').on('mouseleave', function() {
		clearInterval(timer);
	});
	
	$('.date_bt').on('mousedown', function() {
			
		var id = this.id;	
		timer = setInterval(function() {
			console.log(' select id : ' + id );
			date_value_up_down(id);
		}, 100);
		
	});
	
	$('.date_bt').on('click', function() {
		clearInterval(timer);
				
		console.log( date_time_str );
	});
		
	$('.date_val').on('click', function() {
		
		socket.emit('onboard_on');
		$('#'+this.id).select();
		
	}).on('change', function() {
		// date_config_vals[this.id.slice(0,this.id.indexOf("_"))] = $('#'+this.id).val();
	});
	
	$('#dt_apply').on('click', function() {
		alert_flag_parent = alert_flag.date_time;
		$( alert_dlg ).dialog( "open" );		// dialog close
	});
	
	$('#dt_cancel').on('click', function() {
		$('#day_val').val(date_config_vals.past_day);
		$('#month_val').val(date_config_vals.past_month);
		$('#year_val').val(date_config_vals.past_year);
		$('#hour_val').val(date_config_vals.past_hour);
		$('#min_val').val(date_config_vals.past_min);
		$('#sec_val').val(date_config_vals.past_sec);
		
		date_config_vals.year = date_config_vals.past_year;
		date_config_vals.month = date_config_vals.past_month;
		date_config_vals.day = date_config_vals.past_day;
		
		date_config_vals.hour = date_config_vals.past_hour;
		date_config_vals.min = date_config_vals.past_min;
		date_config_vals.sec = date_config_vals.past_sec;
	});
	
	var clean_err_dlg = $("#clean_err_dlg").dialog({
		stack: false,
		modal: true,
		dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		open: function( event, ui ) {
		
		},
		close: function( event, ui ) {
		
		},
		closeOnEscape: false,
		closeText: null
	});
	
	var air_err_dlg = $("#air_err_dlg").dialog({
		stack: false,
		//dialogClass: 'no-close',
		modal: true,
		autoOpen: false,
		resizable: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		open: function( event, ui ) {
			err_airdlg_open_flag = 1;
		},
		close: function( event, ui ) {
			
			// eject_on_off(0);	// eject off
			if( err_dlg_auto_close_flag != 1 ) {
				
				Eject_Feed_onoff_val.EjectOnOff = 0;				
				$("#eject").css("background", "#6DCBB0");
				$("#eject").html("EJECT OFF");

				Command = '4';
				address =  Eject_Feed_onoff_addr.EjectOnOff;
				value = Eject_Feed_onoff_val.EjectOnOff.toString();
				socket_emit(ID, Command, address, value);
				
				Eject_Feed_onoff_val.FeedOnOff = 0;				
				$("#feed").css("background", "#6DCBB0");
				$("#feed").html("FEED OFF");
				
				Command = '4';				
				address =  Eject_Feed_onoff_addr.FeedOnOff;	// Address store	
				value = Eject_Feed_onoff_val.FeedOnOff.toString();  		// must be "toString()"
				socket_emit(ID, Command, address, value);
			
				// eject value check
				if( ( Eject_Feed_onoff_val.EjectOnOff == 1 ) || ( Eject_Feed_onoff_val.FeedOnOff == 1 ) ) {
					// disable
					$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable
				} 
				else if ( ( Eject_Feed_onoff_val.EjectOnOff == 0 ) && ( Eject_Feed_onoff_val.FeedOnOff == 0 ) ){
					// enable
					$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode disable
				}
				
			}
			
			err_dlg_auto_close_flag = 0;
		},
		closeOnEscape: false,
		closeText: null
	});
	
	var chute_err_dlg = $("#chute_err_dlg").dialog({
		stack: false,
		//dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		open: function( event, ui ) {
		
		},
		close: function( event, ui ) {
		
		},
		closeOnEscape: false,
		closeText: null
	});
	socket.on('feed_value_condition', function(data) {
		console.log('feed_value_condition data : ' + data);
		var feed_vibration_val = new Array(8);
		var feed_condition_val = new Array(8);
		feed_vibration_val[0] = parseInt(data, 10);
		
		$('#Adv_feed_vibrate_1').val(feed_vibration_val[0]);
	});
	
	socket.on('err_check_response', function(data) {
					
		// console.log('err_check_response: ' + data);
		err_code_str = data;
				
		// clean_err_dlg, air_err_dlg, chute_err_dlg
		switch(err_code_str) {
			
			// cleaning..
			case err_code.cleaning:	
									// console.log('err_code.cleaning: State...');
									$(air_err_dlg).dialog("close");
									$(chute_err_dlg).dialog("close");
									
									err_dlg_auto_close_flag = 0;
									
									if( dialog_open_check(clean_err_dlg) != 1 ) {
										all_err_dlg_close();
										$(clean_err_dlg).dialog("open");
									} 
									
									break;
			// air down error
			case err_code.air: 	
								//console.log('err_code.air: State...');
								$(clean_err_dlg).dialog("close");
								$(chute_err_dlg).dialog("close");
								
								err_dlg_auto_close_flag = 0;
								
								if( err_airdlg_open_flag == 0 ) {
									// air low dialog open
									if( dialog_open_check(air_err_dlg) != 1 ) {
										all_err_dlg_close();
										$(air_err_dlg).dialog("open");
									} else {
										$(air_err_dlg).dialog("open");
									}
									console.log('err_airdlg_open_flag == 0');
								}
								else if( Eject_Feed_onoff_val.EjectOnOff == 1 || Eject_Feed_onoff_val.FeedOnOff == 1) {	// eject on
									// air low dialog open
									if( dialog_open_check(air_err_dlg) != 1 ) {
										all_err_dlg_close();
										$(air_err_dlg).dialog("open");
										console.log('air_err_dlg open');
									} else {
										$(air_err_dlg).dialog("open");
										console.log('air_err_dlg open');
									}
									console.log('Eject_Feed_onoff_val.EjectOnOff == 1');
								} else {
									console.log('err_airdlg else');
								}
								break;
			// normal state
			case normal_code: 	// console.log('Normal State...');
								err_dlg_auto_close_flag = 1;
								all_err_dlg_close();
								if( fix_flag != 1 && video_dlg_open_flag==1) {
									if ( err_video_flag == 1 ) {
										component_send();
										err_video_flag = 0;
									}	
								}
								break;
			
			default: 	//err_code.chute
						console.log('err_code.chute: State...');
						err_dlg_auto_close_flag = 0;
						
						// chute error number display
						var chute_err_num = ( parseInt(err_code_str.charAt(2), 10) + 1 );
						$("#chute_err").html("Chute "+chute_err_num)
						.css('font-size', '60px')
						.css('color', 'red');

						if( dialog_open_check(chute_err_dlg) != 1 ) {
							all_err_dlg_close();
							$(chute_err_dlg).dialog("open");
						} else {
							$(chute_err_dlg).dialog("open");
						}
						break;
		
		}
		
	});
	// Error Check Variable End ==
	
	var progressTimer;
	var progress_dlg = 	$( "#progress_dlg" ).dialog({
		stack: false,
		title: 'INIT PROGRAM..',
		autoOpen: true,
		resizable: false,	
		draggable: false,
		modal: true,
		position : { my: "center", at: "center", of: window },
		width:700,
		show: {
			effect: "none",
			duration: 100
		},
		hide: {
			effect: "none",
			duration: 100
		},
		closeOnEscape: false,
		closeText: null
	});
	
	// progressbar Close function
	function progressClose() {
		progressLabel.text( "Complete!" );
		clearTimeout(timer);
		$("#progress_dlg").dialog('close');
	}
	
	// progressbar setting
	var progressbar = $("#progressbar" ), progressLabel = $(".progress-label" );
	progressbar.progressbar({
		value: false,
		change: function() {
			progressLabel.text( progressbar.progressbar( "value" ) + "%" );
		},
		complete: function() {
			timer = setTimeout(progressClose, 500);
		}
	});  
		
	var progress_val = 0;
	function progress( ) {
		var val = progressbar.progressbar( "value" ) || 0;
		//console.log('progress value :' +  val);
		
		progress_val++;
		progressbar.progressbar( "value", progress_val );
		if( progress_val >= 100 ) {
			clearInterval(progressTimer);
		}
	}
	
	// Validate_Dialog init ============================== 
	var validate_dlg = $("#validate_dlg").dialog({
		stack: false,
		title: 'VALIDATE',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top", at: "center top" },
		width:1010,
		height:690,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		open : function(event, ui){
            
		},
		closeOnEscape: false,
		closeText: null,
		close : function(event, ui) {
			
			validate_value_send();
			
			var valid_ps = 	$("#valid_1").val()+','+$("#valid_2").val()+','+
							$("#valid_3").val()+','+$("#valid_4").val()+','+
							$("#valid_5").val()+','+$("#valid_6").val();
			
			console.log('validate password : ' +valid_ps);
			
			socket.emit('validate_pass_save', valid_ps);
		}
	});
	
	// password input Dialog init ============================== 
	var pass_input_dlg = $("#pass_input_dlg").dialog({
		stack: true,
		title: 'PASSWORD',
		dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center center", at: "center center" },
		width:700,
		height:310,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		open: function( event, ui ) {
			
			switch( pass_match_process) {
				case pass_match_processes.validate_unlock:	
						
						break;
				
				case pass_match_processes.validate:

						break;
				
				case pass_match_processes.account:	
						switch( account_id.select ) {
							case 'admin' :
								$("#pass_input_dlg").dialog({ title: 'Log On Account'});
								$('#pass_input_lab').html('Admin Password : ');
								break;
							
							case 'engineer':
								$("#pass_input_dlg").dialog({ title: 'Log On Account'});
								$('#pass_input_lab').html('Engineer Password : ');
								break;
							
							default : break;
						}
						break;
				
				default: break;
			}
			
			$('#pass_input').val('');
			//socket.emit('onboard_on');
		},
		close: function( event, ui ) {
			
		},
		closeOnEscape: false,
		closeText: null
	});
		
	// User Name _Dialog init ============================== 
	var user_dlg = $("#user_dlg").dialog({
		stack: false,
		title: 'User Name',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center center", at: "center center" },
		width:500,
		height:250,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		open: function( event, ui ) {
			// main user name load
			user.name = $("#username").val(); 
			user.past_name = user.name;
			$("#user_name_input").val( user.name );
		},
		close: function( event, ui ) {
			
		}
	});
	
	// Alert_Dialog init ============================== 
	var alert_dlg = $("#alert_dlg").dialog({
		stack: false,
		title: 'Alert',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center-200 left", at: "center left" },
		width:300,
		height:240,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		open: function( event,ui) {
			
		},
		close: function( event, ui ) {
			
		}
	});
		
	// Password_Dialog init ============================== 
	var password_dlg = $("#password_dlg").dialog({
		stack: false,
		title: 'Password Change',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null,
		closeOnEscape: false,
		close: function( event, ui ) {
			//$("span.ui-dialog-title").text(past_dialog_title);
		}
	});
	
	// password change check dialog
	var message_alert_dlg = $("#message_alert_dlg").dialog({
		stack: false,
		title: 'Alert',
		// dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center center", at: "center center" },
		width:500,
		height:250,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null,
		closeOnEscape: false
	});
	
	$("#message_alert_btn").click( function() {
		$( message_alert_dlg ).dialog( "close" );
	});
		
	// mode_copy dialog init start ============
	var mode_copy_dlg = $("#mode_copy_dlg").dialog({
		stack: false,
		title: 'MODE',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		open: function(event, ui) {
			
			var i=0;
			
			past_mode_name = mode_names["mode_"+(mode_val.mode+1)];
			for( var key in mode_names) {
				if ( mode_names["mode_"+(mode_val.mode+1)] != mode_names[key] ) {
					$('#mode_list').append('<option value='+key+'>'+ mode_names[key] +'</option>');
				}
			}
			$('#mode_list').selectmenu('refresh', true);
			
			$('#target_mode').val(mode_names["mode_"+(mode_val.mode+1)]);
						
			alert_flag_parent = alert_flag.mode;
			
		},
		close: function( event, ui ) {
			$('#mode_list').html('');
		}		
	});
	
	$( "#mode_list" ).selectmenu({
		select: function( event, ui ) {},
		width : $(this).width() - 200
	}).on( "selectmenuselect", function( event, ui ) {
		console.log('this.value : '+this.value);
		
		mode_num = parseInt(this.value.slice(-1))-1;	// 1~8 => 000~111b
		console.log('mode_num : '+mode_num);
		
		Command = '4';
		address =  mode_func_addr.source;
		value = mode_num.toString();
		socket_emit(ID, Command, address, value);
	
	});
	
	// mode_copy dialog init end ============
			
	// menu_dlg init ============================== 
	var menu_dlg = $("#menu_dlg").dialog({
		stack: false,
		title: 'MENU',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1002,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null,
		closeOnEscape: false,
		close: function( event, ui ) {
			 menu_toggle = 0;
		}
	});
	
	// start_dlg init ============================== 
	var start_dlg = $("#start_dlg").dialog({
		stack: false,
		title: 'START',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1002,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null,
		closeOnEscape: false,
		close: function( event, ui ) {
			start_menu_toggle=0;
		}								
	});
	
	// Help_Dlg init ============================== 
	var help_Dlg = $("#help_dlg").dialog({
		stack: false,
		title: 'HELP',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height:630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
											
	});
	
    // Feed_Dlg init ============================== 
	var Feed_Dlg = $("#Feed_Dlg").dialog({
		stack: false,
		//title: 'FEED',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left+120 top+150", at: "left top" },
		width:460,
		height: 420,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
											
	});
	// Feed_Dlg init END==============================
			
	// Defect_Dlg init START==============================
	var Defect_Dlg = $("#Defect_Dlg").dialog({
		stack: false,
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left+120 top+150", at: "left top" },
		width:460,
		height: 420,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
	});
	// Defect_Dlg init END==============================
	
	// Defect_Dlg init START==============================
	var Defect_Pxl_Dlg = $("#Defect_Pxl_Dlg").dialog({
		stack: false,
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left+120 top+150", at: "left top" },
		width:460,
		height: 420,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
	});
	// Defect_Dlg init END==============================
	
	// RGB_Dlg init START==============================
	var RGB_Dlg = $("#RGB_Dlg").dialog({
		stack: false,
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left+120 top+150", at: "left top" },
		width:460,
		height:420,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null									
	});
	// RGB_Dlg init END==============================
	
	// Feed_Adv_Dlg Dialog START
	var Feed_Adv_Dlg = $(".Feed_Adv_Dlg").dialog({
		stack: false,
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+11", at: "center top" },
		width:1012,
		height: 685,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		open : function(event, ui) {
			feed_condi_timer = setInterval( feed_condition_check, 1000 );
		}, 
		close:function(event, ui) {
			clearInterval(feed_condi_timer);
		}
	});	
	// Feed_Adv_Dlg Dialog END
	
	// Camera_Adv_Dlg Dialog START
	var Camera_Adv_Dlg = $("#Camera_Adv_Dlg").dialog({
		stack: false,
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		width:1015,
		height: 680,
		position : { my: "center top+10", at: "center top" },
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null				
	});	
	// Camera_Adv_Dlg Dialog END
		
	// Ejecting_Control_Dlg START
	var Ejecting_Control_Dlg = $("#Ejecting_Control_Dlg").dialog({
		stack: false,
		title:'EJECTING',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width: 1010,
		height: 630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
		
	});
	// Ejecting_Control_Dlg END
	
	// Cleaning Dialog START	
	var Cleaning_Dlg = $("#Cleaning_Dlg").dialog({
		stack: false,
		title:'CLEANING',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width: 1010,
		height: 630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		close: function( event, ui ) {
			//console.log('Cleaning_Dlg Close');
			if( cleaning_val.Manual == 1 ) {
				cleaning_val.Manual = 0;
				$('#clean-title-manual').css("background", "#04B486");
				$('#clean-title-manual').html("OFF");
				
				Command = '1';
				address = cleaning_addr.Manual;			// cleaning Manual addrss
				value = cleaning_val.Manual.toString();	// must be toString()
				socket_emit(ID, Command, address, value);	
				
				// main page acknack
				//AckNack_Addr_Store( '#AckNack' );
				//device_addr_AckNack = '#AckNack';
			}
		}		
	});	
	// Cleaning Dialog END
	
	// Camera_onoff Dialog START
	var Camera_onoff_dlg = $("#Camera_Onoff_Dlg").dialog({
		stack: false,
		title:'CAMERA ON/OFF',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width:1010,
		height: 630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null				
	});	
	// Camera_onoff Dialog END
	
	// Shutdown Dialog START
	var shutdown_dlg = $("#shutdown_dlg").dialog({
		stack: false,
		title:'SHUTDOWN',
		dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		width:'350px',
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null				
	});	
	// Shutdown Dialog END
	
	// System off Dialog START	
	var System_Dlg = $("#system_dlg").dialog({
		stack: false,
		title:'SYSTEM OFF',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center", of: window },
		width: 400,
		buttons: {
			"Cancel": function() {
				$( this ).dialog( "close" );
			},
			"Shut Down": function() {
				$( this ).dialog( "close" );
				$(shutdown_dlg).dialog("open");
				
				shutdown_state = shutdown_states.feed_off;
				shutdown_timer = setInterval( system_off_func, 1000 );
				
			}
		},
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
	});	
	// System off Dialog END
	
	/* mode_init_dlg start */ 
	var mode_init_dlg = $("#mode_init_dlg").dialog({
		stack: false,
		title:'MODE INIT..',
		dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center", of: window },
		width: 400,
		height: 250,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null									
	});
	/* mode_init_dlg end */ 
	
	// Lighting Dialog START	
	var Lighting_Dlg = $("#Lighting_Dlg").dialog({
		stack: false,
		title:'LIGHTING',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+60", at: "center top" },
		width: 1010,
		height: 630,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null									
	});	
	// Lighting Dialog END
		
	// Model Dialog START	
	var Model_Dlg = $("#Model_Dlg").dialog({
		stack: false,
		title:'MODEL',
		autoOpen: false,
		resizable: false,
		modal: false,
		draggable: false,
		position : { my: "center top+10", at: "center top" },
		width: 1010,
		height: 680,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null
	});	
	// Model Dialog END
	
	// Airgun Dialog START	
	var airgun_dlg = $("#airgun_dlg").dialog({
		stack: false,
		title: 'AIRGUN',
		stack: false, 
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "center top+11", at: "center top" },
		width: 1010,
		height: 682,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		open: function( event, ui ) {},
		close: function( event, ui ) {
			
			clearInterval(auto_timer);	// auto stop(END)
			
			// auto end: manual change
			$("#manual_auto").val(0);
			$("#manual_auto").html("MANUAL").css('background', '#6DCBB0');
			
			Command = '1';
			
			address = rgb_addr.part;	// RGB_A or RGB_B
			value = '0';				// airgun check stop value: must be toString()
			socket_emit(ID, Command, address, value);
			
			$("#start_stop").html('STOP').css('background', '#6DCBB0');	// stop enable
			$("#start_stop").val(0);	// stop enable
			/* RGB A1~A6, B1~B6 Data end */
			
			Command = '4';
			// eject off
			address =  Eject_Feed_onoff_addr.EjectOnOff;
			value = '0';  	// must be "toString()"
			socket_emit(ID, Command, address, value);
			
			Eject_Feed_onoff_val.EjectOnOff = 0;
			$("#eject").html("EJECT OFF").css("background", "#6DCBB0");
			
			Command = '4';
			// feed off
			address =  Eject_Feed_onoff_addr.FeedOnOff;
			value = '0';  	// must be "toString()"
			socket_emit(ID, Command, address, value);
			
			Eject_Feed_onoff_val.FeedOnOff = 0;
			$("#feed").html("FEED OFF").css("background", "#6DCBB0");
			
			// Mode enable disable
			if( ( Eject_Feed_onoff_val.EjectOnOff == 1 ) || ( Eject_Feed_onoff_val.FeedOnOff == 1 ) ) {
				// disable
				$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable
			} else if ( ( Eject_Feed_onoff_val.EjectOnOff == 0 ) && ( Eject_Feed_onoff_val.FeedOnOff == 0 ) ){
				// enable
				$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode enable
			}
		}
	});
	// Airgun Dialog END
	
	// Video Dialog START	
	var video_dlg = $("#video_dlg").dialog({
		title: 'VIDEO',
		stack: false, 
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left top+5", at: "center top" },
		width: 1023,
		height: 680,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null,
		open: function( event, ui ) {
			
			video_dlg_open_flag = 1;	// open
			
			// component_list init start
			$('#component_list').html('');
			for ( var i=0; i<=model_val.channel; i++ ) {
				$('#component_list').append('<option value='+(i+1)+'>'+(i+1)+'</option>');
			}
			$('#component_list').selectmenu('refresh', true);
			// component_list end
			
			// clearInterval(err_check_timer);
				
			// form value init start =========== 
			video_val.form = 0;
			$("#form").html('Corr.');
			$("#form").val(0);
			
			Command = '4';
			address = video_addr.form;
			value = video_val.form.toString();
			socket_vd_emit(ID, Command, address, value);
			// form value init end =========== 
				
			// component value emit start =========== 
			$("#component_list option[value=1]").prop("selected", true);
			$('#component_list').selectmenu('refresh', true);
			
			video_val.component = 1;
			video_val.html_component = 1;
			
			Command = '4';
			address = video_addr.component;
			value = video_val.component.toString();
			socket_vd_emit(ID, Command, address, value);
			// component value emit end	 =========== 
		
		},
		close: function( event, ui ) {
			
			video_dlg_open_flag = 0;
			
			// form value init start
			video_val.form = 0;
			$("#form").html('Corr.');
			$("#form").val(0);
			
			Command = '4';
			address = video_addr.form;
			value = video_val.form.toString();
			socket_vd_emit(ID, Command, address, value);
			// form value init end
			
			var el = document.getElementById('eject');
			el.disabled = false;
			
			// err_check_timer init
			// err_check_timer = setInterval( error_check_func, 1000);
			
		}
	});
	// Video Dialog END
	
	function fix_timer_func() {
		fix_timer_cnt++;
		console.log(fix_timer_cnt);
		$("#fix_text").html("Fix Timer : ").append(document.createTextNode( (13-fix_timer_cnt) +'' ));
				
		if( fix_timer_cnt > 12 ) {
				
			fix_flag = 0;
			fix_timer_cnt = 0;
			component_send();
			$( fix_timer_dlg ).dialog( "close" );
			clearInterval(fix_timer);
		
		}
		
	}
	
	/* fix timer dlg start */ 
	var fix_timer_dlg = $("#fix_timer_dlg").dialog({
		stack: false,
		title:'FIX TIMER',
		dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center", of: window },
		width: 300,
		height: 170,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeOnEscape: false,
		closeText: null									
	});
	/* fix timer dlg end */

	// Alert_Dialog init ============================== 
	var vd_alert_dlg = $("#vd_alert_dlg").dialog({
		stack: false,
		title: 'Alert',
		dialogClass: 'no-close',
		autoOpen: false,
		resizable: false,		
		modal: true,
		draggable: false,
		position : { my: "center-200 left", at: "center left" },
		width:350,
		height:350,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null,
		closeOnEscape: false,
		close: function( event, ui ) {
			
		},
		buttons: {
			"Yes": function() {
				img_recv_stop();
				
				if( video_val.html_component > 0 ) {
					
					// fix value emit start
					Command = '4';
					address = video_addr.fix;
					video_val.fix = 1;
									
					// 2^0 ~ 2^7
					for(var i=0; i<(video_val.html_component-1); i++){
						video_val.fix*=2;
					}
					console.log('video_val.fix: '+video_val.fix);
					
					value = video_val.fix.toString();
					socket_vd_emit(ID, Command, address, value);
					// fix value emit end
							
				}
				img_recv_start();	// comp_stop_flag = 0
				$( this ).dialog( "close" );
				
				$("#fix_text").html("Fix Timer")
				$( fix_timer_dlg ).dialog( "open" );
				fix_flag = 1;
				fix_timer = setInterval(fix_timer_func, 1000);
				
			},
			"No": function() {
				
				$( this ).dialog( "close" );
			}
		}
	});
	
	// background_front_Dlg init == 
	var bg_f_dlg = $("#dv_bg_f_dlg").dialog({
		stack: false,
		title: 'Background Front',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left+150 top-200", of: window },
		width:400,
		height:230,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null
											
	});
	// background_front_Dlg init END ==
	
	// background_rear_Dlg init == 
	var bg_r_dlg = $("#dv_bg_r_dlg").dialog({
		stack: false,
		title: 'Background Rear',
		autoOpen: false,
		resizable: false,		
		modal: false,
		draggable: false,
		position : { my: "left+150 top-200", of: window },
		width:400,
		height:230,
		show: {
			effect: "none",
			duration: 200
		},
		hide: {
			effect: "none",
			duration: 200
		},
		closeText: null
											
	});
	// background_rear_Dlg init END ==
	
	var theCanvas = $("#myCanvas1").get(0);
	var context = theCanvas.getContext("2d");
	
	CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
					
		if (dashLen == undefined) dashLen = 2;
		this.moveTo(x1, y1);

		var dX = x2 - x1;
		var dY = y2 - y1;
		var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
		var dashX = dX / dashes;
		var dashY = dY / dashes;

		var q = 0;
		while (q++ < dashes) {
			x1 += dashX;
			y1 += dashY;
			this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
		}
		this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
	};
	
	function img_recv_stop() {
		comp_stop_flag = 1;
	}
	
	function img_recv_start() {
		comp_stop_flag = 0;
	}
	
	function grid_func() {
		 
		var dot_width=1;
		var x2=1024, y2=300;
		context.beginPath();
		 
		context.strokeStyle = "white";
		context.lineWidth=1;
		
		context.moveTo(45+1, 0);
		context.lineTo(45+1, 300);
		
		context.moveTo(141+1, 0);
		context.lineTo(141+1, 300);
		 
		// center
		context.moveTo(511, 0);
		context.lineTo(511, 300);
		
		context.moveTo(512, 0);
		context.lineTo(512, 300);
		
		context.moveTo(882-1, 0);	
		context.lineTo(882-1, 300);
		
		context.moveTo(978-1, 0);
		context.lineTo(978-1, 300);
		
		
		context.stroke();
		context.closePath();
		
		
		// 4 is dashLen
		// context.dashedLine(x, y, x + width, y, 4);
		
		// horizontal grid lines
		for (var x = 11; x < 1024; x += 50) {
			
			if( x != 511 ) {
				context.beginPath();
				context.moveTo(x, 0);
				
				context.lineWidth=1;		
				context.strokeStyle = "#303030";
				context.dashedLine(x, 0, x+dot_width, y2, 4);
				context.stroke();
				context.closePath();
			}
		}
		
		// vertical grid lines 
		for (var y = 300; y > 0; y -= 50) {
			context.beginPath();
			context.moveTo(0, y);
			
			context.lineWidth=1;		
			context.strokeStyle = "#303030";
			context.dashedLine(0, y, x2, y+dot_width, 4);
			context.stroke();
			context.closePath();
		}				
		
	}
	
	grid_func();	// grid init		

	$( "#bgf_slider" ).slider({	range: "min", value: 512,  min: 0,  max: 1023 }).width(310).height(32);
	$( "#bgr_slider" ).slider({	range: "min", value: 512,  min: 0,  max: 1023 }).width(310).height(32);
	
	$( "#bgf_slider" ).slider({
		slide: function( event, ui ) {
			back_front_val.html_val = ui.value; 
			if(back_front_val.html_val <= 0) back_front_val.html_val=0;
			if(back_front_val.html_val<=255) {
				back_front_val.bg_f_h = 0;
				back_front_val.bg_f_l = back_front_val.html_val;
			}else if(back_front_val.html_val>=256 && back_front_val.html_val<512){ 
				// 255 < back_front_val.bg_f_l < 512
				back_front_val.bg_f_h = 1;	// 0100000000b
				back_front_val.bg_f_l = back_front_val.html_val-256;
			}else if(back_front_val.html_val>=512 && back_front_val.html_val<768){	
				// 512 < back_front_val.bg_f_l < 768
				back_front_val.bg_f_h = 2;	// 1000000000b	
				back_front_val.bg_f_l = back_front_val.html_val-512;
			}else {	// back_front_val.bg_f_l > 768
				back_front_val.bg_f_h = 3;	// 1100000000b		
				back_front_val.bg_f_l = back_front_val.html_val-768;
			}
			$( "#bg_f_val" ).val( ui.value );
		}
	});
	
	$( "#bgr_slider" ).slider({
		slide: function( event, ui ) {
			back_rear_val.html_val = ui.value; 
			if(back_rear_val.html_val<=255) {
				back_rear_val.bg_r_h = 0;
				back_rear_val.bg_r_l = back_rear_val.html_val;
			}else if(back_rear_val.html_val>=256 && back_rear_val.html_val<512){ 
				// 255 < back_rear_val.bg_r_l < 512
				back_rear_val.bg_r_h = 1;	// 0100000000b
				back_rear_val.bg_r_l = back_rear_val.html_val-256;
			}else if(back_rear_val.html_val>=512 && back_rear_val.html_val<768){	
				// 512 < back_rear_val.bg_r_l < 768
				back_rear_val.bg_r_h = 2;	// 1000000000b	
				back_rear_val.bg_r_l = back_rear_val.html_val-512;
			}else {	// back_rear_val.bg_r_l > 768
				back_rear_val.bg_r_h = 3;	// 1100000000b		
				back_rear_val.bg_r_l = back_rear_val.html_val-768;
			}
			$( "#bg_r_val" ).val( ui.value );
		}
	});
	
	$( "#bgf_slider" ).on( "slidestop", function( event, ui ) {
		
		$("#bg_f_display_val").val(ui.value);
		
		Command = '1';
		address = back_front_addr.bg_f_l;
		value = back_front_val.bg_f_l.toString();
		console.log('back_front_val low');
		socket_vd_emit(ID, Command, address, value);
		
		Command = '1';					
		address = back_front_addr.bg_f_h;
		value = back_front_val.bg_f_h.toString();
		console.log('back_front_val high');
		socket_vd_emit(ID, Command, address, value);
	
	});
	
	$( "#bgr_slider" ).on( "slidestop", function( event, ui ) {
		$("#bg_r_display_val").val(ui.value);
		
		Command = '1';
		address = back_rear_addr.bg_r_l;
		value = back_rear_val.bg_r_l.toString();
		console.log('back_rear_val low');
		socket_vd_emit(ID, Command, address, value);
		
		Command = '1';
		address = back_rear_addr.bg_r_h;
		value = back_rear_val.bg_r_h.toString();
		console.log('back_rear_val high');
		socket_vd_emit(ID, Command, address, value);
	
	});
	
	$( "#component_list" ).selectmenu({
		select: function( event, ui ) {}
	});
	
	$('.ui-selectmenu-button [id=component_list]').css('height', 58).css('font-size', 30);
				
	// select list position	init
	var position = $( "#component_list" ).selectmenu( "option", "position" );

	// select list position setter
	$( "#component_list" ).selectmenu( 'option', 'position', { my : "left+10 center", at: "right center" } );
	
	$( "#component_list" ).on( "selectmenuselect", function( event, ui ) {
		
		img_recv_stop();
		
		console.log('selectmenu select value: ' + this.value);
		// socket.emit('image_send', { val:this.value });
		
		// form value init start
		video_val.form = 0;
		$("#form").html('Corr.');
		$("#form").val(0);
		
		
		var el = document.getElementById("eject");
		el.disabled = false;
		
		Command = '4';
		address = video_addr.form;
		value = video_val.form.toString();
		socket_vd_emit(ID, Command, address, value);
		// form value init end
		
		if (this.value == 0) {
			
			video_val.html_component=this.value;
			console.log('video_val.html_component value: ' + video_val.html_component);
			/*
			Command = '4';
			address = video_addr.component;
			value = '0';
			socket_emit(ID, Command, address, value);
			*/
			
		} else {
			
			video_val.html_component=this.value;
			console.log('video_val.html_component value: ' + video_val.html_component);
			
			/*
			video_val.component = 1;
			
			// 2^0 ~ 2^7
			for(var i=0; i<(video_val.html_component-1); i++){
				video_val.component*=2;
			}
			
			// component value 1~128
			Command = '4';
			address = video_addr.component;
			value = video_val.component.toString();
			socket_emit(ID, Command, address, value);
			*/
			
		}		
		
		img_recv_start();
	
	});
	
	$('#all_save').click(function() {
		
		img_recv_stop();
		
		Command = '4';	
		// gain value emit start
		address = video_addr_A.gain;
		video_val.gain = 255;
		console.log('video_val.gain: '+video_val.gain);				
		value = video_val.gain.toString();
		socket_vd_emit(ID, Command, address, value);
		// gain value emit end
		
		Command = '4';
		// gain value emit start
		address = video_addr_B.gain;
		video_val.gain = 255;
		console.log('video_val.gain: '+video_val.gain);				
		value = video_val.gain.toString();
		socket_vd_emit(ID, Command, address, value);
		// gain value emit end
				
		img_recv_start();
											
	});
	
	$('#FIX').click(function() {
		$(vd_alert_dlg).dialog("open");
	});
	
	$('#rgb_type').click(function() {
		
		if ( rgb_type_flag == rgb_type_flags.rgb ) {
			rgb_type_flag = rgb_type_flags.rgb_b;
			$("#rgb_type").html("RGB B");
		} else if( rgb_type_flag == rgb_type_flags.rgb_b ){
			rgb_type_flag = rgb_type_flags.rgb_g;
			$("#rgb_type").html("RGB G");
		} else if( rgb_type_flag == rgb_type_flags.rgb_g ){
			rgb_type_flag = rgb_type_flags.rgb_r;
			$("#rgb_type").html("RGB R");
		} else {
			rgb_type_flag = rgb_type_flags.rgb;
			$("#rgb_type").html("RGB");
		}
	});
	
	
	function component_send() {
		
		/*
		* eject off syntax
		* $('#form').val == 0 => Corr.
		* $('#form').val == 1 => Raw
		*/
		var form_val = $('#form').val(); 
		if ( form_val == 1 ) {
			
			if( once_eject_flag != 1 ) {
				Eject_Feed_onoff_val.EjectOnOff = 0;
				$("#eject").css("background", "#6DCBB0");
				$("#eject").html("EJECT OFF");
				
				// Mode enable disable
				if( ( Eject_Feed_onoff_val.EjectOnOff == 1 ) || ( Eject_Feed_onoff_val.FeedOnOff == 1 ) ) {
					// disable
					$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable	
				} 
				else if ( ( Eject_Feed_onoff_val.EjectOnOff == 0 ) && ( Eject_Feed_onoff_val.FeedOnOff == 0 ) ){
					// enable
					$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode enable	
				}	
				
				Command = '4';
				address =  Eject_Feed_onoff_addr.EjectOnOff;
				value = Eject_Feed_onoff_val.EjectOnOff.toString();  // must be "toString()
				socket_vd_emit(ID, Command, address, value);
			}
			once_eject_flag = 1;
			
		} else {
			once_eject_flag = 0;
		}
		
		if (video_val.html_component == 0) {
						
			console.log('video_val.html_component value: ' + video_val.html_component);
			Command = '4';
			address = video_addr.component;
			value = '0';
			socket_vd_emit(ID, Command, address, value);
			image_recv_comp_flag = 0;
			
		} else {
			
			console.log('video_val.html_component value: ' + video_val.html_component);
			
			video_val.component = 1;
			
			// 2^0 ~ 2^7
			for(var i=0; i<(video_val.html_component-1); i++){
				video_val.component*=2;
			}
			
			// component value 1~128
			Command = '4';
			address = video_addr.component;
			value = video_val.component.toString();
			socket_vd_emit(ID, Command, address, value);
			image_recv_comp_flag = 0;
			
		}
	}
	
	function make_int (High_value, Low_value) {
				    
		// upper
		if ( High_value >= 65 && High_value <= 70) {
			High_value =( High_value-65+ 10);
		} else if( High_value >= 48 && High_value <= 57 ) {
			High_value =( High_value -48);
		} 
		
		if ( High_value >= 97 && High_value <= 102) {
			High_value =( High_value-97+ 10);
		} else if( High_value >= 48 && High_value <= 57 ) {
			High_value =( High_value -48);
		}
			
		// lower
		if ( Low_value >= 65 && Low_value <= 70 ) {
			Low_value =( Low_value-65+ 10);
		} else if( Low_value >= 48 && Low_value <= 57 ) {
			Low_value =( Low_value-48);
		} 

		if ( Low_value >= 97 && Low_value <= 102) {
			Low_value =( Low_value -97+ 10);
		} else if( Low_value >= 48 && Low_value <= 57 ) {
			Low_value =( Low_value-48);
		}
		
		// console.log(' HighLow value: '+((High_value*16)+Low_value));
		return ((High_value*16)+Low_value);
	
	}										
	
	socket.on('image_receive', function(image_data){
			
		var High_low_index = 0;
		var High_low_value = 0;
		var rgb_cnt = 0;
		var x_pos = 0, y_pos = 0;
		var past_x_pos_r=0, past_y_pos_r=0;
		var past_x_pos_g=0, past_y_pos_g=0;
		var past_x_pos_b=0, past_y_pos_b=0;
		
		console.log('image_receive...');
		context.clearRect(0, 0, theCanvas.width, theCanvas.height);
		grid_func();
						
		//console.log('new image image_data: '+ image_data);
		console.log('new image length: '+ image_data.length);
		
		High_value = image_data.charCodeAt(0);
		Low_value = image_data.charCodeAt(1);
		y_pos = make_int(High_value,Low_value);
		past_y_pos_r = 300 - y_pos;
				
		High_value = image_data.charCodeAt(2);
		Low_value = image_data.charCodeAt(3);
		y_pos = make_int(High_value,Low_value);
		past_y_pos_g = 300 - y_pos;
		
		High_value = image_data.charCodeAt(4);
		Low_value = image_data.charCodeAt(5);
		y_pos = make_int(High_value,Low_value);
		past_y_pos_b = 300 - y_pos;

		if( video_val.part == 'a' ) {
			
			x_pos = 1023;
			past_x_pos_r=1023;
			past_x_pos_g=1023;
			past_x_pos_b=1023;
		
			console.log('part RGB '+video_val.part);
			
			for (var i=0; i<image_data.length; i++){	
				
				if (High_low_index ==0 ) {  //high value
					High_value = image_data.charCodeAt(i);
					High_low_index = 1;
				}
				else	//low value
				{
					Low_value = image_data.charCodeAt(i);
					High_low_index =0;
					y_pos = make_int(High_value,Low_value);
					y_pos = 300 - y_pos;
					// console.log('image_receive...'+ y_pos );
					
					rgb_cnt++;
					
					if ( rgb_cnt==1 ) {		// red
						if(	(rgb_type_flag != rgb_type_flags.rgb_b) && (rgb_type_flag != rgb_type_flags.rgb_g) ) {					
							context.beginPath();
							context.moveTo(past_x_pos_r, past_y_pos_r);
							context.lineTo(x_pos, y_pos);
										
							context.strokeStyle="#FF0000";
							context.lineWidth=1;
							context.stroke();
							context.closePath();
						}
						// past x,y pos: red
						past_y_pos_r = y_pos;
						past_x_pos_r = x_pos;
					}
					else if ( rgb_cnt==2 ) {	// green
						if(	(rgb_type_flag != rgb_type_flags.rgb_b) && (rgb_type_flag != rgb_type_flags.rgb_r) ) {
							// path init	
							context.beginPath();
							context.moveTo(past_x_pos_g, past_y_pos_g);
							context.lineTo(x_pos, y_pos);
															
							context.strokeStyle="#00FF00";
							context.lineWidth=1;
							context.stroke();
							context.closePath();
						}
						// past x,y pos: green	
						past_y_pos_g = y_pos;
						past_x_pos_g = x_pos;
					}
					else if ( rgb_cnt==3 ) {	// blue
						
						if(	(rgb_type_flag != rgb_type_flags.rgb_g) && (rgb_type_flag != rgb_type_flags.rgb_r) ) {									
							// path init		
							context.beginPath();
							context.moveTo(past_x_pos_b, past_y_pos_b);
							context.lineTo(x_pos, y_pos);
												
							context.strokeStyle="#0000FF";
							context.lineWidth=1;
							context.stroke();
							context.closePath();
						}
						// past x, y pos: blue
						past_y_pos_b = y_pos;
						past_x_pos_b = x_pos;
						
						rgb_cnt = 0;	// rgb_cnt init, for rgb data
						
						x_pos--;
					}
				}
			}
			console.log('image_display complite!!');
		} else {
		
			past_x_pos_r=0;
			past_x_pos_g=0;
			past_x_pos_b=0;
			x_pos = 0;
			
			console.log('part RGB '+video_val.part);
			
			for (var i=0; i<image_data.length; i++){	
				
				if (High_low_index ==0 ) {  //high value
					High_value = image_data.charCodeAt(i);
					High_low_index = 1;
				}
				else	//low value
				{
					Low_value = image_data.charCodeAt(i);
					High_low_index =0;
					y_pos = make_int(High_value,Low_value);
					y_pos = 300 - y_pos;
					// console.log('image_receive...'+ y_pos );
					
					rgb_cnt++;
					
					if ( rgb_cnt==1 ) {		// red
						
						if(	(rgb_type_flag != rgb_type_flags.rgb_b) && (rgb_type_flag != rgb_type_flags.rgb_g) ) {
							context.beginPath();
							context.moveTo(past_x_pos_r, past_y_pos_r);
							context.lineTo(x_pos, y_pos);
										
							context.strokeStyle="#FF0000";
							context.lineWidth=1;
							context.stroke();
							context.closePath();
						}	
						
						// past x,y pos: red
						past_y_pos_r = y_pos;
						past_x_pos_r = x_pos;
					
					}
					else if ( rgb_cnt==2 ) {	// green
						if(	(rgb_type_flag != rgb_type_flags.rgb_b) && (rgb_type_flag != rgb_type_flags.rgb_r) ) {
							// path init	
							context.beginPath();
							context.moveTo(past_x_pos_g, past_y_pos_g);
							context.lineTo(x_pos, y_pos);
															
							context.strokeStyle="#00FF00";
							context.lineWidth=1;
							context.stroke();
							context.closePath();
						}
						// past x,y pos: green	
						past_y_pos_g = y_pos;
						past_x_pos_g = x_pos;
					}
					else if ( rgb_cnt==3 ) {	// blue
						
						if(	(rgb_type_flag != rgb_type_flags.rgb_g) && (rgb_type_flag != rgb_type_flags.rgb_r) ) {
							// path init		
							context.beginPath();
							context.moveTo(past_x_pos_b, past_y_pos_b);
							context.lineTo(x_pos, y_pos);
												
							context.strokeStyle="#0000FF";
							context.lineWidth=1;
							context.stroke();
							context.closePath();
						}
						// past x, y pos: blue
						past_y_pos_b = y_pos;
						past_x_pos_b = x_pos;
						
						rgb_cnt = 0;	// rgb_cnt init, for rgb data
						
						x_pos++;
					}
				}
			
			}
			console.log('image_display complite!!');
			
		}
		
		image_recv_comp_flag = 1;
		
		if( err_code_str == normal_code ) {
			err_video_flag = 0;
			if( fix_flag!=1 && video_dlg_open_flag==1 ) component_send();
		} else {
			err_video_flag = 1;
		}
			
	});
	
	// Camera A, B choice, toggle
	$("#vd_part").click(function() {
		
		img_recv_stop();
		
		/*
		// past part address value 0 init start
		address = video_addr.component;
		value = '0';
		video_val.html_component = 0;
		socket_emit(ID, Command, address, value);
		console.log('part event: video_val.html_component ='+video_val.html_component);
		// past part address value 0 init end
		*/
		
		// A, B part toggle(현재 상태를 보여줌)
		if( video_val.part == 'a' ) {	
			$("#vd_part").html('B');
			video_addr = video_addr_B;
			video_val = video_val_B;
		}	
		else if( video_val.part == 'b' ) {
			$("#vd_part").html('A');
			video_addr = video_addr_A;
			video_val = video_val_A;
		}	
							
		// html display					
		
		// form value init start
		video_val.form = 0;
		$("#form").html('Corr.');
		$("#form").val(0);
		
		Command = '4';
		address = video_addr.form;
		value = video_val.form.toString();
		socket_vd_emit(ID, Command, address, value);
		// form value init end
		
		var el = document.getElementById("eject");
		el.disabled = false;
							
		img_recv_start();
		video_val.html_component = 1;
		
		$("#component_list option[value="+video_val.html_component+"]").prop("selected", true);
		$('#component_list').selectmenu('refresh', true);
		
	});
	
	// Save	
	$("#gain").click(function() {
		
		img_recv_stop();
		
		if( video_val.html_component > 0 ) {
			
			/*
			// component value '0' emit
			console.log('video_val.html_component value: ' + video_val.html_component);
			address = video_addr.component;
			value = '0';
			socket_emit(ID, Command, address, value);
			*/
			
			// gain value emit start
			Command = '4';
			address = video_addr.gain;
			video_val.gain = 1;
							
			// 2^0 ~ 2^7
			for(var i=0; i<(video_val.html_component-1); i++){
				video_val.gain*=2;
			}
			console.log('video_val.gain: '+video_val.gain);
		
			value = video_val.gain.toString();
			socket_vd_emit(ID, Command, address, value);
			// gain value emit end
			
		}
		
		img_recv_start();
		
	});
	
	$("#dv_bg_f_bt").click(function() {
		Vd_Dialog_Close();
		$( bg_f_dlg ).dialog( "open" );		// dialog open
	});
	
	$("#dv_bg_r_bt").click(function() {
		Vd_Dialog_Close();
		$( bg_r_dlg ).dialog( "open" );		// dialog open
	});
	
	$("#form").click(function() {
		
		img_recv_stop();
		
		if( video_val.html_component > 0 ) {
			
			/*
			// component off
			console.log('video_val.html_component value: ' + video_val.html_component);
			address = video_addr.component;
			value = '0';
			socket_emit(ID, Command, address, value);
			*/
			
			var el = document.getElementById("eject");
			
			if( this.value == 0 ) {
				/*
				Eject_Feed_onoff_val.EjectOnOff = 0;
				$("#eject").css("background", "#6DCBB0");
				$("#eject").html("EJECT OFF");
				*/			
			
				$("#form").html('Raw');		
				this.value = 1;
				video_val.form = 1;
				el.disabled= true;
				
			} else {
			
				$("#form").html('Corr.');
				this.value = 0;
				video_val.form = 0;
				el.disabled= false;
			
			}
			
			// 2^0 ~ 2^7
			for(var i=0; i<(video_val.html_component-1); i++){
				video_val.form*=2;
			}
			console.log('form value: ' + this.value);
									
			// video signal form select start
			Command = '4';
			address = video_addr.form;
			value = video_val.form.toString();
			socket_vd_emit(ID, Command, address, value);
			// video signal form select end

			img_recv_start();	
			
		}
		
	});
	
	$(".bg_f_arrow_button").mouseleave(function() {
		clearInterval(timer);
	});
	
	$(".bg_f_arrow_button").mouseup(function() {
		clearInterval(timer);		
	});
	
	$(".bg_f_arrow_button").mousedown(function() {
		
		img_recv_stop();
		var click_id = this.id;
		
		timer = setInterval(function() {
			
			// console.log('bgf mouse down'); 
			switch(click_id) {
			case 'bg_f_down': 
					back_front_val.html_val-=1;
					if(back_front_val.html_val <= 0) back_front_val.html_val=0;
					
					if(back_front_val.html_val<=255) {
						back_front_val.bg_f_h = 0;
						back_front_val.bg_f_l = back_front_val.html_val;
					}else if(back_front_val.html_val>=256 && back_front_val.html_val<512){ 
						// 255 < back_front_val.bg_f_l < 512
						back_front_val.bg_f_h = 1;	// 0100000000b
						back_front_val.bg_f_l = back_front_val.html_val-256;
					}else if(back_front_val.html_val>=512 && back_front_val.html_val<768){	
						// 512 < back_front_val.bg_f_l < 768
						back_front_val.bg_f_h = 2;	// 1000000000b	
						back_front_val.bg_f_l = back_front_val.html_val-512;
					}else {	// back_front_val.bg_f_l > 768
						back_front_val.bg_f_h = 3;	// 1100000000b		
						back_front_val.bg_f_l = back_front_val.html_val-768;
					}
				break;
			
			case 'bg_f_up': 
					back_front_val.html_val+=1;
					if(back_front_val.html_val >= 1023) back_front_val.html_val=1023;
					
					if(back_front_val.html_val<=255) {
						back_front_val.bg_f_h = 0;
						back_front_val.bg_f_l = back_front_val.html_val;
					}else if(back_front_val.html_val>=256 && back_front_val.html_val<512){ 
						// 255 < back_front_val.bg_f_l < 512
						back_front_val.bg_f_h = 1;	// 0100000000b
						back_front_val.bg_f_l = back_front_val.html_val-256;
					}else if(back_front_val.html_val>=512 && back_front_val.html_val<768){	
						// 512 < back_front_val.bg_f_l < 768
						back_front_val.bg_f_h = 2;	// 1000000000b	
						back_front_val.bg_f_l = back_front_val.html_val-512;
					}else {	// back_front_val.bg_f_l > 768
						back_front_val.bg_f_h = 3;	// 1100000000b		
						back_front_val.bg_f_l = back_front_val.html_val-768;
					}
					break;
					
			}
		
			$("#bg_f_display_val").val(back_front_val.html_val);
			$("#bg_f_val").val(back_front_val.html_val);
			$( "#bgf_slider" ).slider( "option", "value", back_front_val.html_val );
					
		}, 200);
		
		img_recv_start();
	});
	
	// back_front_val up and down
	$(".bg_f_arrow_button").click(function() {
		
		img_recv_stop();
		
		var click_id = this.id;
		
		//console.log(click_id);
		switch(click_id) {
			case 'bg_f_down': 
					back_front_val.html_val-=1;
					if(back_front_val.html_val <= 0) back_front_val.html_val=0;
					
					if(back_front_val.html_val<=255) {
						back_front_val.bg_f_h = 0;
						back_front_val.bg_f_l = back_front_val.html_val;
					}else if(back_front_val.html_val>=256 && back_front_val.html_val<512){ 
						// 255 < back_front_val.bg_f_l < 512
						back_front_val.bg_f_h = 1;	// 0100000000b
						back_front_val.bg_f_l = back_front_val.html_val-256;
					}else if(back_front_val.html_val>=512 && back_front_val.html_val<768){	
						// 512 < back_front_val.bg_f_l < 768
						back_front_val.bg_f_h = 2;	// 1000000000b	
						back_front_val.bg_f_l = back_front_val.html_val-512;
					}else {	// back_front_val.bg_f_l > 768
						back_front_val.bg_f_h = 3;	// 1100000000b		
						back_front_val.bg_f_l = back_front_val.html_val-768;
					}
				break;
			
			case 'bg_f_up': 
				back_front_val.html_val+=1;
				if(back_front_val.html_val >= 1023) back_front_val.html_val=1023;
				
				if(back_front_val.html_val<=255) {
					back_front_val.bg_f_h = 0;
					back_front_val.bg_f_l = back_front_val.html_val;
				}else if(back_front_val.html_val>=256 && back_front_val.html_val<512){ 
					// 255 < back_front_val.bg_f_l < 512
					back_front_val.bg_f_h = 1;	// 0100000000b
					back_front_val.bg_f_l = back_front_val.html_val-256;
				}else if(back_front_val.html_val>=512 && back_front_val.html_val<768){	
					// 512 < back_front_val.bg_f_l < 768
					back_front_val.bg_f_h = 2;	// 1000000000b	
					back_front_val.bg_f_l = back_front_val.html_val-512;
				}else {	// back_front_val.bg_f_l > 768
					back_front_val.bg_f_h = 3;	// 1100000000b		
					back_front_val.bg_f_l = back_front_val.html_val-768;
				}
				break;
				
		}
	
		$("#bg_f_display_val").val(back_front_val.html_val);
		$("#bg_f_val").val(back_front_val.html_val);
		$( "#bgf_slider" ).slider( "option", "value", back_front_val.html_val );
		
		
		Command = '1';
		address = back_front_addr.bg_f_l;
		value = back_front_val.bg_f_l.toString();
		console.log('back_front_val low');
		socket_vd_emit(ID, Command, address, value);
		
		Command = '1';					
		address = back_front_addr.bg_f_h;
		value = back_front_val.bg_f_h.toString();
		console.log('back_front_val high');
		socket_vd_emit(ID, Command, address, value);
				
		img_recv_start();		
	});
	
	$(".bg_r_arrow_button").mouseleave(function() {
		clearInterval(timer);
	});
	
	// back_rear_value up and down
	$(".bg_r_arrow_button").mouseup(function() {
		clearInterval(timer);
	});
	
	$(".bg_r_arrow_button").mousedown(function() {
		img_recv_stop();
		var click_id = this.id;
		
		timer = setInterval( function() {
			
			switch(click_id) {
			
			case 'bg_r_down': 
					back_rear_val.html_val-=1;
					if(back_rear_val.html_val <= 0) back_rear_val.html_val=0;
					
					if(back_rear_val.html_val<=255) {
						back_rear_val.bg_r_h = 0;
						back_rear_val.bg_r_l = back_rear_val.html_val;
					}else if(back_rear_val.html_val>=256 && back_rear_val.html_val<512){ 
						// 255 < back_rear_val.bg_r_l < 512
						back_rear_val.bg_r_h = 1;	// 0100000000b
						back_rear_val.bg_r_l = back_rear_val.html_val-256;
					}else if(back_rear_val.html_val>=512 && back_rear_val.html_val<768){	
						// 512 < back_rear_val.bg_r_l < 768
						back_rear_val.bg_r_h = 2;	// 1000000000b	
						back_rear_val.bg_r_l = back_rear_val.html_val-512;
					}else {	// back_rear_val.bg_r_l > 768
						back_rear_val.bg_r_h = 3;	// 1100000000b		
						back_rear_val.bg_r_l = back_rear_val.html_val-768;
					}
				break;
			
			case 'bg_r_up': 
					back_rear_val.html_val+=1;
					if(back_rear_val.html_val >= 1023) back_rear_val.html_val=1023;
					
					if(back_rear_val.html_val<=255) {
						back_rear_val.bg_r_h = 0;
						back_rear_val.bg_r_l = back_rear_val.html_val;
					}else if(back_rear_val.html_val>=256 && back_rear_val.html_val<512){ 
						// 255 < back_rear_val.bg_r_l < 512
						back_rear_val.bg_r_h = 1;	// 0100000000b
						back_rear_val.bg_r_l = back_rear_val.html_val-256;
					}else if(back_rear_val.html_val>=512 && back_rear_val.html_val<768){	
						// 512 < back_rear_val.bg_r_l < 768
						back_rear_val.bg_r_h = 2;	// 1000000000b	
						back_rear_val.bg_r_l = back_rear_val.html_val-512;
					}else {	// back_rear_val.bg_r_l > 768
						back_rear_val.bg_r_h = 3;	// 1100000000b		
						back_rear_val.bg_r_l = back_rear_val.html_val-768;
					}
					break;	
			}
		
			$("#bg_r_display_val").val(back_rear_val.html_val);
			$("#bg_r_val").val(back_rear_val.html_val);
			$( "#bgr_slider" ).slider( "option", "value", back_rear_val.html_val );
		
		}, 200);
		
		img_recv_start();
	});
	
	$(".bg_r_arrow_button").click(function() {
		
		img_recv_stop();
		
		var click_id = this.id;
		
		// console.log(click_id);
		switch(click_id) {
			
			case 'bg_r_down': 
					back_rear_val.html_val-=1;
					if(back_rear_val.html_val <= 0) back_rear_val.html_val=0;
					
					if(back_rear_val.html_val<=255) {
						back_rear_val.bg_r_h = 0;
						back_rear_val.bg_r_l = back_rear_val.html_val;
					}else if(back_rear_val.html_val>=256 && back_rear_val.html_val<512){ 
						// 255 < back_rear_val.bg_r_l < 512
						back_rear_val.bg_r_h = 1;	// 0100000000b
						back_rear_val.bg_r_l = back_rear_val.html_val-256;
					}else if(back_rear_val.html_val>=512 && back_rear_val.html_val<768){	
						// 512 < back_rear_val.bg_r_l < 768
						back_rear_val.bg_r_h = 2;	// 1000000000b	
						back_rear_val.bg_r_l = back_rear_val.html_val-512;
					}else {	// back_rear_val.bg_r_l > 768
						back_rear_val.bg_r_h = 3;	// 1100000000b		
						back_rear_val.bg_r_l = back_rear_val.html_val-768;
					}
				break;
			
			case 'bg_r_up': 
				back_rear_val.html_val+=1;
				if(back_rear_val.html_val >= 1023) back_rear_val.html_val=1023;
				
				if(back_rear_val.html_val<=255) {
					back_rear_val.bg_r_h = 0;
					back_rear_val.bg_r_l = back_rear_val.html_val;
				}else if(back_rear_val.html_val>=256 && back_rear_val.html_val<512){ 
					// 255 < back_rear_val.bg_r_l < 512
					back_rear_val.bg_r_h = 1;	// 0100000000b
					back_rear_val.bg_r_l = back_rear_val.html_val-256;
				}else if(back_rear_val.html_val>=512 && back_rear_val.html_val<768){	
					// 512 < back_rear_val.bg_r_l < 768
					back_rear_val.bg_r_h = 2;	// 1000000000b	
					back_rear_val.bg_r_l = back_rear_val.html_val-512;
				}else {	// back_rear_val.bg_r_l > 768
					back_rear_val.bg_r_h = 3;	// 1100000000b		
					back_rear_val.bg_r_l = back_rear_val.html_val-768;
				}
				break;	
		}
		
		$("#bg_r_display_val").val(back_rear_val.html_val);
		$("#bg_r_val").val(back_rear_val.html_val);
		$( "#bgr_slider" ).slider( "option", "value", back_rear_val.html_val );			
		
		Command = '1';					
		address = back_rear_addr.bg_r_l;
		value = back_rear_val.bg_r_l.toString();
		socket_vd_emit(ID, Command, address, value);
		
		Command = '1';
		address = back_rear_addr.bg_r_h;
		value = back_rear_val.bg_r_h.toString();
		socket_vd_emit(ID, Command, address, value);
		
		img_recv_start();
		
	});
	
	/* List menu click event 
	MENU 
		config : Language, Model, Authorization
		state :	reserved
		maintain : Airgun
		control : Cleaning, Mode, Lighting, Camera, Ejecting, Video
	*/
	
	$(".sub_menu_4").click( function() {
		console.log(this.id);
		switch(this.id) {
		
			case 'System_off':	All_Dialog_Close();
								
								$( System_Dlg ).dialog( "open" );
								break;
			
			default : break;
		}
	});
	
	$(".airgun_sub").click( function() {
		console.log(this.id);
		switch(this.id) {
		
			case 'menu_airgun':	All_Dialog_Close();
								$( "#airgun_dlg" ).dialog( "open" );
								break;
			
			default : break;
		}
	});
	
	/* Validate setting dialog open start */
	$( "#valid_check_btn_1" ).button().click(function() {

		this.value = 1;
		
		var check_btn2_val = $( "#valid_check_btn_2" ).val();
		
		if( (check_btn2_val == 1) && (this.value == 1) ) {
			// console.log('valid_bt_1');
			pass_match_process = pass_match_processes.validate;
			
			if( current_account == accounts.admin ) {
				$("#pass_input_dlg").dialog({ title: 'Validate Configuration'});
				$('#pass_input_lab').html('Admin Password : ');
			} else {
				$("#pass_input_dlg").dialog({ title: 'Validate Configuration'});
				$('#pass_input_lab').html('Engineer Password : ');
			}
			
			$(pass_input_dlg).dialog("open");
						
			// value init
			this.value = 0;
			$( "#valid_check_btn_2" ).val(0);
		}
			
	});
	
	$( "#valid_check_btn_2" ).button().click(function() {
		this.value = 1;
		
		var check_btn1_val = $( "#valid_check_btn_1" ).val();
		
		if( (check_btn1_val == 1) && (this.value == 1) ) {
			// console.log('valid_bt_1');
			pass_match_process = pass_match_processes.validate;
			
			if( current_account == accounts.admin ) {
				$("#pass_input_dlg").dialog({ title: 'Validate Configuration'});
				$('#pass_input_lab').html('Admin Password : ');
			} else {
				$("#pass_input_dlg").dialog({ title: 'Validate Configuration'});
				$('#pass_input_lab').html('Engineer Password : ');
			}
			$(pass_input_dlg).dialog("open");
						
			// value init
			this.value = 0;
			$( "#valid_check_btn_1" ).val(0);
		}
	});
	/* Validate setting dialog open end */
	
	$(".config_sub").click( function() {
		console.log(this.id);
		switch(this.id) {
			case 'menu_language':	
									break;
			
			case 'menu_model':	All_Dialog_Close();
								$( "#Model_Dlg" ).dialog( "open" );
								break;
			
			case 'menu_password':	All_Dialog_Close();
								$( password_dlg ).dialog( "open" )
								
								break;
			default : break;
		}
	});
	
	$(".control_sub").click( function() {
		console.log(this.id);
		switch(this.id) {
			case 'menu_cleaning': 	All_Dialog_Close();
									$( "#Cleaning_Dlg" ).dialog( "open" );
									break;
					
			case 'menu_lighting':	All_Dialog_Close();
									$( Lighting_Dlg ).dialog( "open" );
									break;
							
			case 'menu_camera':		All_Dialog_Close();
									$( Camera_onoff_dlg ).dialog( "open" );
									break;
									
			case 'menu_ejecting':	All_Dialog_Close();
									$( "#Ejecting_Control_Dlg" ).dialog( "open" );
									break;
			
			case 'menu_mode':	All_Dialog_Close();
								$( mode_copy_dlg ).dialog( "open" );
								
								break;
								
			case 'menu_video':	All_Dialog_Close();
								$( video_dlg ).dialog( "open" );
								break;	
			
			default : break;
		}
	});
	
	$("#pass_input").click(function() {
		$('#'+this.id).focus();
		socket.emit('onboard_on');
	});
	
	/* Password input Dialog click Start */
	$(".pass_input_bts").click( function() {
		
		switch(this.id) {
			case 'pass_input_apply': 	
	
					switch( pass_match_process) {
						
						case pass_match_processes.validate_unlock:	
									
									var pass_val = $("#pass_input").val().toString();
									var pass_idx = 0, idx = 0;
									
									for(var key in valid_flag) {
									
										if( date_onoff_vals[key] != 0 ) {
											if ( valid_flag[key] != true ) {
												pass_idx = idx;
											}
											idx++;
										}
									
									}
								
									socket.emit('validate_pass_check', {
										idx: pass_idx,
										val: pass_val
									});
									
									break;
									
						case pass_match_processes.validate:

									var pass_val = $("#pass_input").val().toString();
									socket.emit('pass_val_check', {
										state:accounts[account_id.select], 
										val: pass_val
									});
									break;
									
						default: 	
									var pass_val = $("#pass_input").val().toString();
									socket.emit('pass_val_check', {
										state: accounts[account_id.select], 
										val: pass_val
									});
									
									break;
					}
					
					$("#pass_input").val("");	// inputbox init
					$(pass_input_dlg).dialog("close");
					
					break;
	
			case 'pass_input_cancel': 	
										// password dlg : Cancel click
										// account init <= past account
										switch( pass_match_process) {
											case pass_match_processes.account:
												current_account = accounts[account_id.past_id];
												account_id.select = account_id.current;
												break;
										}
										
										$(pass_input_dlg).dialog("close");
										break;
			
			default:	break;
		}
	});
	/* Password input Dialog click End */
	
	// check number
	function checkNum(val, id) {
		var flag=true;
		res3 = (/^[0-9]*$/i).test(val); 
		if (val != "") { 
			if( !res3 ) {
				flag = false;
				validate_error_id = "#"+id;				
			}
		}
		return flag;
	}
	
	function bubbleSort(theArray) {
		
		var i, j;
		
		for( i=theArray.length-1; i>=0; i-- ) {
			
			for (j = 0; j <= i; j++) {
			
				if (theArray[j + 1] < theArray[j]) {
					var temp = theArray[j];
										
					theArray[j] = theArray[j + 1];
					theArray[j + 1] = temp;
										
				}
			}
		}
		return theArray;
	}

	
		
	/* validate event start */
	$(".validate_inputs").click( function() {
		$('#'+this.id).focus();
	});
		
	$(".validate_pass").click( function() {
		$('#'+this.id).focus();
		socket.emit('onboard_on');
	});
	
	$(".validate_pass").on('keyup', function() {
		console.log(this.id+' : '+this.value);
	});
	
	function validate_value_send( ) {
	
		for( var i=1; i<7; i++ ) {
			date_vals['stop_'+i] = $("#stop_date_"+i).val();	
			console.log('stop data: ' + date_vals['stop_'+i] );
		}
		
		socket.emit('validate_all_save', { stop_date: date_vals });
		
	}
	
	socket.on('validate_pass_res', function(data) {
		
		console.log( data.idx +', acknack val: ' + data.acknack);
		var valid_idx = parseInt(data.idx)+1;	// +1 : start 0
		console.log('valid_idx = ' + valid_idx);
		
		if( data.acknack == ACK	) {
			
			validate_flag = true;
			
			console.log('data.acknack == ACK');
			
			for( var idx=1; idx<=valid_idx; idx++ ) {
				
				if ( parseInt(date_onoff_vals['stop_'+idx]) == 1 ) {
					valid_flag[ 'stop_'+idx ] = true;
					date_onoff_vals['stop_'+idx] = 0;
					$("#date_"+idx).val(0).html("Disable").css('background', '#6DCBB0');			
				}
				
			}
			socket.emit('validate_onoff_save', date_onoff_vals);
			
			if( current_account == accounts.operator ) {
				
				// account is operator
				enableElements();
				
				document.getElementById("help").disabled=true;
				$( "#menu_3" ).menu( "option", "disabled", true );	// menu disable
				console.log('line 4340 current_account : '+current_account);
			
			} else {
				// account is admin and engineer
				document.getElementById("mode_list_top_menu").disabled=false;
				document.getElementById("help").disabled=false;
				$( "#menu_3" ).menu( "option", "disabled", false );	// menu enable
				console.log('line 4346 current_account : '+current_account);
			}
					
		} else {

		}
		
		validate_check_program();
		
		if ( validate_flag != true ) {
			pass_match_process = pass_match_processes.validate_unlock;
			
			// console.log(parseInt( $("#date").val().slice(6,10)));
			if( $("#date").val().slice(6,10) != '1970' ) {
				$("#pass_input_dlg").dialog({ title: 'Program Password'});
				$('#pass_input_lab').html('Validate Password : ');
				$(pass_input_dlg).dialog("open");	
			} 
			disableElements();
			
		} else {
			operator_enableElements();
		}
		
	});
	
	socket.on('validate_onoff_response', function(data) {
		
		console.log('validate_onoff_response event');
		
		var idx=0;
				
		// console.log('data : ' + data);
		// validate buttons init
		for(var key in date_onoff_vals) {
		
			date_onoff_vals[key] = parseInt(data[key], 10);
			
			$("#date_"+(idx+1)).val(date_onoff_vals[key]);
			
			if( date_onoff_vals[key] == 0 ) {
				$("#date_"+(idx+1)).html("Disable").css('background', '#6DCBB0');
			} else {
				$("#date_"+(idx+1)).html("Enable").css('background', '#D5FFE8');
			}
			
			idx++;
		}
		
	});
		
	socket.on('validate_pass_response', function(data) {
	
		for(var i=0; i<6; i++) {
			$('#valid_'+(i+1)).val(data[i]);
			// console.log('valid_'+(i+1)+' : '+data[i]);
		}
		
	});	
	
	// validate read response : validate read init response
	socket.on('validate_read_response', function(data) {
		
		// debug
		// console.log('validate_read_response: '+ data);
		
		var i=0;
		
		for(var key in date_vals) {
			
			date_vals[key] = data[i];
			
			// debug
			// console.log('date_vals: '+date_vals[key]);
			
			// date_vals[key] == '-' is date value true
			if( date_vals[key] != '-' ) {
				$( "#stop_date_"+(i+1) ).datepicker( "setDate", date_vals[key] );	
			} else {	// date_vals[key] != '-' is date value false
				$( "#stop_date_"+(i+1) ).val( date_vals[key] );
			}
		
			i++;	// id value find
		}
				
		validate_check_program();
		/*
		for(var key in valid_flag) {
			if( date_onoff_vals[key] != 0 ) {
				if ( valid_flag[key] != true ) {
					validate_flag = false;
				}
			}
		}
		
		if ( validate_flag != true ) {
			pass_match_process = pass_match_processes.validate_unlock;
			
			// console.log(parseInt( $("#date").val().slice(6,10)));
			if( $("#date").val().slice(6,10) != '1970' ) {
				$("#pass_input_dlg").dialog({ title: 'Program Password'});
				$('#pass_input_lab').html('Validate Password : ');
				$(pass_input_dlg).dialog("open");	
			} 
			disableElements();
			
		} else {
			enableElements();
		}
		*/
	});
				
	$(".date_toggles").click(function() {
		
		var idx=1;
		
		// console.log(this.id);
		if( this.value == 0) {
			this.value = 1;
			$('#'+this.id).html("Enable").css('background', '#D5FFE8');
			console.log(this.id+' : '+ this.value);
		} else {
			this.value = 0;
			$('#'+this.id).html("Disable").css('background', '#6DCBB0');
			console.log(this.id+' : '+ this.value);
		}
		
		for(var key in date_onoff_vals) {
			date_onoff_vals[key] = $("#date_"+(idx++)).val();
		}
		
		socket.emit('validate_onoff_save', date_onoff_vals);
		
	});
	
	$( '#stop_date_1' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true,
		onClose: function() {
			
		}
	}).change(function() {
		
	});
	
	$( '#stop_date_2' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true
	}).change(function() {
		
	});
	
	$( '#stop_date_3' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true
	}).change(function() {	
		
	}); 
	
	$( '#stop_date_4' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true
	}).change(function() {
		
	});
	$( '#stop_date_5' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true
	}).change(function() {
		
	});
	
	$( '#stop_date_6' ).datepicker({
		dateFormat: "dd-mm-yy",
		changeMonth: true,
		changeYear: true
	}).change(function() {
		
	});
	/* validate event end */
	
	/* username input start */
	// username input btn click
	$("#username").click(function() {
		$(user_dlg).dialog("open");
	});
	
	$("#user_name_input").click(function() {
		console.log("user name onfocus");
		socket.emit('onboard_on');
	});
	
	$(".user_bts").click(function() {
		switch( this.id ) {
			case 'user_rename':	
								user.name = $("#user_name_input").val();
								$("#username").val(user.name);
								socket.emit("user_name_input" , { name:user.name });
								break;
			
			case 'user_cancel':	user.name = user.past_name;
								$("#user_name_input").val(user.name);
								socket.emit("user_name_input" , { name:user.name });
								break;
			
			default :	break;
		}
	});
	/* username input end */
	
	/* Password change click event Start */
	$(".pass_inputs").click(function() {
		$('#'+this.id).focus();
		socket.emit('onboard_on');
	});
	
	$(".pass_init_bts").click(function() {
		console.log(this.id);
		console.log('current accout id : ' + account_id.current);
		// console.log('select accout id : ' + account_id.select);
		
		pass_init_id = this.id;
		alert_flag_parent = alert_flag.pass_init;
		
		if( account_id.current == 'admin' ) {
			$( alert_dlg ).dialog( "open" );
		} else {
		
			if( pass_init_id == 'pass_engi' ) {
				$( alert_dlg ).dialog( "open" );
			} else {
				console.log('Access denied');
				$("#alert_content").html("Access denied");
				$(message_alert_dlg).dialog("open");
			}
		
		}
		
	});
	
	function wordch(thisword){
	
		var flag = true;
		var specialChars="~`!@#$%^&*-=+\|[](){};:'<.,>/?_";

		wordadded = thisword;
		
		for (i = 0; i < wordadded.length; i++) {
			for (j = 0; j < specialChars.length; j++) {         
				if (wordadded.charAt(i) == specialChars.charAt(j)) { 
					flag=false;
					break;
				}
			}
		}
		return flag;
	}
	
	function pass_config_check() {
		
		if (!wordch(pass.old_val)){ 
			pass_flag = 'special';
			pass_error_id = "#pass_old";
			return 0;
		}
		if (!wordch(pass.new_val)){ 
			pass_flag = 'special';
			pass_error_id = "#pass_new";
			return 0;
		}
		if (!wordch(pass.confirm_val)){ 
			pass_flag = 'special';
			pass_error_id = "#pass_confirm";
			return 0;
		}
		
		// value length check
		if ( (pass.old_val.length<4)||(pass.old_val.length>10) ) {
			pass_flag = 'length';
			pass_error_id = "#pass_old";
			return 0;
		} 
		if ( (pass.new_val.length<4)||(pass.new_val.length>10) ) {
			pass_flag = 'length';
			pass_error_id = "#pass_new";
			return 0;
		}
		if ( (pass.confirm_val.length<4)||(pass.confirm_val.length>10) ) {
			pass_flag = 'length';
			pass_error_id = "#pass_confirm";
			return 0;
		}
		
		// new value, confirm value compare
		if( pass.new_val != pass.confirm_val ) {
			pass_flag = 'differ';
			pass_error_id = "#pass_new";
			console.log('new_val: ' + pass.new_val);
			console.log('confirm_val: ' + pass.confirm_val);
			return 0;
		}
			
		pass_flag = 'ok';
		return 1;
	}
	 	
	$("#pass_apply").click(function() {
		
		var check_flag;
		
		pass.old_val = $("#pass_old").val().toString();
		pass.new_val = $("#pass_new").val().toString();
		pass.confirm_val = $("#pass_confirm").val().toString();	
		
		check_flag = pass_config_check();
		
		if( check_flag != 1 ) {	// length or differ flag set(pass value error)
			
			$(pass_error_id).focus().select();
										
			switch(pass_flag) {
				
				case pass_flags.length:	console.log('length error');
										$("#alert_content").html("Password is short.");
										$(message_alert_dlg).dialog("open");
										break;
				
				case pass_flags.special:	console.log('special error');
											$("#alert_content").html("Special characters are not allowed.");
											$(message_alert_dlg).dialog("open");
											break;
											
				case pass_flags.differ:	$("#alert_content").html("Password is different.");
										$(message_alert_dlg).dialog("open");
										console.log('differ error');
										break;
				
				
						
				default: break;
			}
		}
		else {	// pass value ok 
			console.log('pass value ok!!');
			alert_flag_parent = alert_flag.pass_change;
			$( alert_dlg ).dialog( "open" );
		}
	});
	
	$(".alert_bts").click(function() {
		
		switch( alert_flag_parent ) {
			
			case alert_flag.mode_change:
				
				switch(this.id) {
					
					case 'yes':
						mode_val.mode = $('#'+select_mode_id).val();
						$("#mode_menu_title").html( $('#'+select_mode_id).html());
						if( mode_val.past_val != mode_val.mode ) {
							
							All_Dialog_Close();
							//console.log(this.id);	// this.id Mode_1 ~ 8
										
							// mode value init
							Command = '4';
							address = mode_addr.mode;				// address store
							value =  mode_val.mode.toString();  	// must be "toString()"
							mode_val.past_val = mode_val.mode;
							socket_emit(ID, Command, address, value);
							
							error_check_func();
							
							step_init('step-1st');
							setTimeout(Read_All_AVR_M_Data, 5000);	// Read avr data
										
						}
						mode_val.past_val = mode_val.mode;
						break;
					
					case 'no':
						
						break;
					
					default: break;
					
				}
				
				break;
				
			case alert_flag.mode: 	
					
					switch(this.id) {
						
						case 'yes': console.log("yes");
									
									mode_num = parseInt($('#mode_list').val().slice(-1))-1;
									console.log('mode_num : '+mode_num);
									
									Command = '4';
									address =  mode_func_addr.source;
									value = mode_num.toString();
									socket_emit(ID, Command, address, value);
									console.log('mode_btns_id : ' + mode_btns_id);
									
									switch(mode_btns_id) {
										
										case "backup": 		console.log('backup yes');
															Command = '4';
															address =  mode_func_addr.backup;
															value = '1';
															socket_emit(ID, Command, address, value);
															break;
															
										case "recovery": 	// clearInterval(err_check_timer);
															console.log('recovery yes');
															Command = '4';
															address =  mode_func_addr.recovery;
															value = '1';
															socket_emit(ID, Command, address, value);
															error_check_func();
															setTimeout(Read_All_AVR_M_Data, 5000);
															
															break;
															
										case "load": 		// clearInterval(err_check_timer);	
															console.log('load yes');
															Command = '4';
															address =  mode_func_addr.load;
															value = '1';
															socket_emit(ID, Command, address, value);
															error_check_func();
															setTimeout(Read_All_AVR_M_Data, 5000);
															
															break;
															
										case "rename": 		console.log('rename yes');
															var mode_name = $("#target_mode").val();
															var mode_name_protocol='';
																							
															$("#mode_menu_title").html(mode_name);
															$("#target_mode").val(mode_name);
															mode_names['mode_'+(parseInt(mode_val.mode)+1)] = mode_name;	// mode name store
															$('#mode_'+(parseInt(mode_val.mode)+1)).html(mode_name);
																									
															for(var key in mode_names) {
																mode_name_protocol += (mode_names[key] + ':');
															}
															mode_name_protocol = mode_name_protocol.slice(0, -1);
															console.log( 'mode_name_protocol : ' + mode_name_protocol); 
															socket.emit('mode_name_save', mode_name_protocol);
															
															// mode name code modify
															var dec;
															dec = parseInt(mode_name_addr['mode_'+(parseInt(mode_val.mode)+1)], 16);
															
															for( var i=0; i<mode_name.length; i++ ) {
																
																mode_name_arr[i] = dec2hex(dec).toString();
																Command = '4';
																address = '0x'+mode_name_arr[i];		// addrss
																value = mode_name[i].charCodeAt(0).toString();		// must be toString()
																// console.log('mode addr : '+address + ' : ' + value);
																																
																socket_emit(ID, Command, address, value);						
																
																dec++;
															}
															mode_name_arr[i] = dec2hex(dec).toString();
															Command = '4';
															address = '0x'+mode_name_arr[i];		// addrss
															value = '0';
															socket_emit(ID, Command, address, value);
															
															break;
																			
										default: break;
										
									}
									break;
						
						case 'no': 	console.log("no");
									switch(mode_btns_id) {
																									
										case "rename": 		console.log('rename no');
															$("#target_mode").val(past_mode_name);
															
															break;
										
										default: break;
										
									}
									break;
						
						default: break;
						
					}
					
					break;
									
			case alert_flag.pass_change: 	var pass_val = $("#pass_confirm").val();		
											
											switch(this.id) {
												
												case 'yes': console.log("yes");

															socket.emit('pass_change', { 
																state: current_account, 
																old_val: pass.old_val, 
																new_val: pass.new_val
															});
															break;
												case 'no': 	console.log("No");
															break;
												default: break;
											
											}
											
											/* input value init*/
											$("#pass_new").val("");
											$("#pass_confirm").val("");
											$("#pass_old").val("");
											
											break;
			
			case alert_flag.pass_init:
								
								switch(this.id) {
									
									case 'yes': 
												switch( account_id.current ) {
													
													case 'admin':
																if( pass_init_id == 'pass_admin' ) {
																	socket.emit('password_init', { state:2 });
																} else if( pass_init_id == 'pass_engi' ) {
																	socket.emit('password_init', { state:3 });
																}
																break;
													
													case 'engineer':
																socket.emit('password_init', { state:3 });
																break;
													
													default: break;			
												}
												break;
												
									case 'no': 	
												// console.log("No");
												break;
												
									default: break;
								}
								
								break;
								
					case alert_flag.date_time: 
															
							switch(this.id) {

								case 'yes':
									console.log('date_time_config_str : '+date_time_str);
									socket.emit('date_and_time_config', date_time_str);
									break;
								
								case 'no': 
								
									break;
							}
							
							break;
							
			default: break;	
		}
				
		$( alert_dlg ).dialog( "close" );		// dialog close
	});
	/* Password click event End */
		
	// Eject on-off
	$("#eject").click(function () {
		
		//console.log('eject value:'+Eject_Feed_onoff_val.EjectOnOff);
		
		if(Eject_Feed_onoff_val.EjectOnOff == 1) {		// case on
			Eject_Feed_onoff_val.EjectOnOff = 0;
			
			$("#eject").css("background", "#6DCBB0");
			$("#eject").html("EJECT OFF");
			//console.log('eject off');
		} else {	// case off
			Eject_Feed_onoff_val.EjectOnOff = 1;
			
			$("#eject").css("background", "#D5FFE8");
			$("#eject").html("EJECT ON");
			//console.log('eject on');
		}
		
		// Mode enable disable
		if( ( Eject_Feed_onoff_val.EjectOnOff == 1 ) || ( Eject_Feed_onoff_val.FeedOnOff == 1 ) ) {
			// disable
			$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable	
		} 
		else if ( ( Eject_Feed_onoff_val.EjectOnOff == 0 ) && ( Eject_Feed_onoff_val.FeedOnOff == 0 ) ){
			// enable
			$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode enable	
		}	
		
		address =  Eject_Feed_onoff_addr.EjectOnOff;
		value = Eject_Feed_onoff_val.EjectOnOff.toString();  // must be "toString()"
		Command = '4';	
		
		if( video_dlg_open_flag == 0 ) {	// video_dialog open
			socket_emit(ID, Command, address, value);	
		} else {
			socket_vd_emit(ID, Command, address, value);
		}
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
	});
	
		
	// Feed on-off
	$("#feed").click(function () {
		
		//console.log('feed value:'+Eject_Feed_onoff_val.FeedOnOff);
		
		if( Eject_Feed_onoff_val.FeedOnOff == 1 ) {	// feed off
			Eject_Feed_onoff_val.FeedOnOff = 0;
			
			$("#feed").css("background", "#6DCBB0");						
			$("#feed").html("FEED OFF");
			//console.log('feed off');
		} else {					// feed on
			Eject_Feed_onoff_val.FeedOnOff = 1;
						
			$("#feed").css("background", "#D5FFE8");
			$("#feed").html("FEED ON");
			//console.log('feed on');
		}
		
		// Mode enable disable
		if( ( Eject_Feed_onoff_val.EjectOnOff == 1 ) || ( Eject_Feed_onoff_val.FeedOnOff == 1 ) ) {
			$( "#mode_list_top_menu" ).menu( "option", "disabled", true );	// mode disable	
		}
		else if( ( Eject_Feed_onoff_val.EjectOnOff == 0 ) && ( Eject_Feed_onoff_val.FeedOnOff == 0 ) ){
			$( "#mode_list_top_menu" ).menu( "option", "disabled", false );	// mode enable	
		}	
		
		address =  Eject_Feed_onoff_addr.FeedOnOff;	// Address store	
		value = Eject_Feed_onoff_val.FeedOnOff.toString();  // must be "toString()"
		Command = '4';	
		
		if( video_dlg_open_flag == 0 ) {	// video_dialog open
			socket_emit(ID, Command, address, value);	
		} else {
			socket_vd_emit(ID, Command, address, value);
		}
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
	});
	
	// step_state 1st, 2nd, 3rd value

	function step_init(step_state) { 
		 
		$('.step_btn').css("background", "#6DCBB0");
		$('#'+step_state).css("background", "#D5FFE8");
		$('#'+step_state+"-img").show(); 				
		// Device address, Device value, Dialog title change
		switch ( step_state ) {
			
			case 'step-1st':	device_addr = device_addr_1;
								device_val  =  device_val_1;
								device_TEXT =  device_TEXT_1;
								$('#'+step_state).css("color", step_color[0]);
								$('#Feed_val').css("color", step_color[0]);
								$('.defect_vals').css("color", step_color[0]);
								$('.RGB_val').css("color", step_color[0]);
								//$('#step-1st-img').attr("src", "");
								$('#step-2nd-img');
								$('#step-3rd-img').hide();
								break;
			
			case 'step-2nd': 	device_addr = device_addr_2; 
								device_val  =  device_val_2;
								device_TEXT =  device_TEXT_2;
								$('#'+step_state).css("color", step_color[1]);
								$('#Feed_val').css("color", step_color[1]);
								$('.defect_vals').css("color", step_color[1]);
								$('.RGB_val').css("color", step_color[1]);
								$('#step-1st-img').hide();
								$('#step-3rd-img').hide();
								break;
			
			case 'step-3rd': 	device_addr = device_addr_3;
								device_val  =  device_val_3;
								device_TEXT =  device_TEXT_3;
								$('#'+step_state).css("color", step_color[2]);
								$('#Feed_val').css("color", step_color[2]);
								$('.defect_vals').css("color", step_color[2]);
								$('.RGB_val').css("color", step_color[2]);
								$('#step-1st-img').hide();
								$('#step-2nd-img').hide();
								break;
						
			default :	device_addr = device_addr_1;
						device_val  =  device_val_1; 
						device_TEXT =  device_TEXT_1;
						$('#'+step_state).css("color", step_color[0]);
						break;
		}
		
		// Main Value Display(init), Feed and Defect value of 1st~3rd 
		$("#Feed_val").val(device_val.Feed);		// Feed value
		$("#Defect_val").val(device_val.Defect);	// Defect value
		$("#defect_pxl").val(device_val.Pxl);		// Defect size value
		
		// Main RGB value Init, BDS ~ RLC 
		$("#B_D_S").val( device_val.B_D_S );
		$("#B_D_C").val( device_val.B_D_C );
		$("#B_L_S").val( device_val.B_L_S );
		$("#B_L_C").val( device_val.B_L_C );
		
		$("#G_D_S").val( device_val.G_D_S );
		$("#G_D_C").val( device_val.G_D_C );
		$("#G_L_S").val( device_val.G_L_S );
		$("#G_L_C").val( device_val.G_L_C );
		
		$("#R_D_S").val( device_val.R_D_S );
		$("#R_D_C").val( device_val.R_D_C );
		$("#R_L_S").val( device_val.R_L_S );
		$("#R_L_C").val( device_val.R_L_C );
		
		for( var key in device_addr ) {
			if( (device_addr[key] >= '0x405') && (device_addr[key] <= '0x428') ) {
				
				if ( device_val[key] == 1 ) {	// on
					$("#"+key.slice(0,5)).css("border", "2px solid #D5FFE8");
					// console.log("border on "+key.slice(0,5));
				} else {	// off
					$("#"+key.slice(0,5)).css("border", "2px solid #6BBA96");
					// console.log("border off "+key.slice(0,5));
				}
			}	
		}
	}
	
	$( ".step_btn" ).click(function() {
		
		All_Dialog_Close();
		
		step_init(this.id);
				
	});
		
	// Feed, Defect Dialog click( open, value up and down, Adv_Dlg open, ok and cancle ) 
	// "#Feed_val", "#Feed_Dlg", "#Feed_Dlg_val", "#Feed_Dlg_Arrow_bt_left", "#Feed_Dlg_Arrow_bt_right", "#Feed_Dlg_bt", #Feed_Dlg_slider, "#Feed_Adv_Dlg", "#Feed_Dlg_ok", "#Feed_Dlg_cancel", "#Feed_Dlg_Ack"	
	function ID_Dlg_Open_START( ID_val, ID_Dlg, ID_Dlg_val, Dlg_left_bt, Dlg_right_bt, ID_Dlg_Adv, ID_Dlg_slider, Adv_Dlg, ID_Dlg_ok, ID_Dlg_cancel, ID_Dlg_Ack ){
	
		var obj_value, obj_value_past, obj_address, obj_title;
		
		// Feed, Defect Open START
		$( ID_val ).click(function() {
					
			All_Dialog_Close();
			
			// ID_val: Feed_val, Defect_val
			switch(ID_val) {
				
				case '#Feed_val':	//console.log( 'device_val.Feed = ' + device_val.Feed);
									
									obj_value = device_val.Feed;	// current value
									device_val.Feed_past = $(ID_val).val();		// past value
									obj_value_past = device_val.Feed_past;
									obj_address = device_addr.Feed;
									obj_title = device_TEXT.Feed;
									//console.log( 'device_val.Feed_past= ' + device_val.Feed_past);
									
									break;
				case '#Defect_val':	obj_value = device_val.Defect;	// current value
									device_val.Defect_past = $(ID_val).val();	// past value
									obj_value_past = device_val.Defect_past;
									obj_address = device_addr.Defect;
									obj_title = device_TEXT.Defect;
									
									//console.log( 'device_val.Defect_past= ' + device_val.Defect_past);
									break;
				
				case '#defect_pxl':	obj_value = device_val.Pxl;	// current value
									device_val.Defect_pxl_past = $(ID_val).val();	// past value
									obj_value_past = device_val.Defect_pxl_past;
									obj_address = device_addr.Pxl;
									obj_title = device_TEXT.Pxl;
									
									//console.log( 'device_val.Defect_past= ' + device_val.Defect_past);
									break;	
				default : break;
				
			}
			
			//$("span.ui-dialog-title").text(obj_title);		// title change
			$(ID_Dlg).dialog({title:obj_title});		// title change
			$(ID_Dlg_val).val(obj_value);					// main feed val

			// obj_value_past = $(ID_Dlg_val).val();			// past val
													
			$( ID_Dlg_val ).val( obj_value_past );				// past value display
			$( ID_Dlg_slider ).slider("value", obj_value_past);	// past value display to slider	
			
			//console.log(obj_title + ': '  + obj_value_past); 	
					
			$( ID_Dlg ).dialog( "open" );		// dialog open
																				
		});
		// Feed, Defect_Dlg Open END
		
		
		// Feed, Defect slider set, slide event
		$( ID_Dlg_slider ).slider({
			slide: function( event, ui ) {
				$( ID_Dlg_val ).val( ui.value );
			}
		});
		
		$( Dlg_left_bt ).mouseup(function() {
			clearInterval(timer);
		});
		
		$( Dlg_left_bt ).mouseleave(function() {
			clearInterval(timer);
		});
		
		// Feed, Defect Dlg left button Start
		$( Dlg_left_bt ).mousedown(function() {
			
			timer = setInterval(function() {
				var current_val = parseInt( $( ID_Dlg_val ).val() );  
				current_val = current_val-1;
				
				if( current_val <= $( ID_Dlg_slider ).slider("option", "min") )
					current_val = $( ID_Dlg_slider ).slider("option", "min");
					
				$( ID_Dlg_val ).val(current_val);
				$( ID_Dlg_slider ).slider("value", current_val);
				//console.log('current_val = ' + current_val);
				$(ID_val).val( $(ID_Dlg_val).val() );	// main value display
				
				switch(ID_val) {
					case '#Feed_val':	device_val.Feed = $(ID_Dlg_val).val();
										break;
					case '#Defect_val': device_val.Defect = $(ID_Dlg_val).val();
										break;					
					case '#defect_pxl': device_val.Pxl = $(ID_Dlg_val).val();
										break;					
					default : break;					
				}			
			}, 100);
		
		});
		
		$( Dlg_left_bt ).click(function() {
			
			var current_val = parseInt( $( ID_Dlg_val ).val() );  
			current_val = current_val-1;
			
			if( current_val <= $( ID_Dlg_slider ).slider("option", "min") )
				current_val = $( ID_Dlg_slider ).slider("option", "min");
				
			$( ID_Dlg_val ).val(current_val);
			$( ID_Dlg_slider ).slider("value", current_val);
			//console.log('current_val = ' + current_val);
			$(ID_val).val( $(ID_Dlg_val).val() );	// main value display
			
			switch(ID_val) {
				case '#Feed_val':	device_val.Feed = $(ID_Dlg_val).val();
									value =  $(ID_Dlg_val).val().toString();  	// must be "toString()"
									break;
				case '#Defect_val': device_val.Defect = $(ID_Dlg_val).val();
									value = (device_val.Defect-1).toString();  	// must be "toString()"
									break;					
				case '#defect_pxl': device_val.Pxl = $(ID_Dlg_val).val();
									value = (device_val.Pxl-1).toString();  	// must be "toString()"
									break;					
				default : break;					
			}			
			
			address =  obj_address;			// device_addr
			
			ID = '01';
			Command = '1';	
			socket_emit(ID, Command, address, value);
			//AckNack_Addr_Store(ID_Dlg_Ack);
			
		});
		// Feed, Defect Dlg left button END
		
		// Feed, Defect Dlg right button Start
		$( Dlg_right_bt ).mouseleave(function() {
			clearInterval(timer);
		});
		
		$( Dlg_right_bt ).mouseup(function() {
			clearInterval(timer);
		});
		
		$( Dlg_right_bt ).click(function() {
			
			var current_val = parseInt( $( ID_Dlg_val ).val() );  
			current_val = current_val+1;
			
			if( current_val >= $( ID_Dlg_slider ).slider("option", "max") )
				current_val = $( ID_Dlg_slider ).slider("option", "max");
				
			$( ID_Dlg_val ).val(current_val);
			$( ID_Dlg_slider ).slider("value", current_val);
			//console.log('current_val = ' + current_val);
			$(ID_val).val( $(ID_Dlg_val).val() );	// main value display
			
			switch(ID_val) {
				case '#Feed_val':	device_val.Feed = $(ID_Dlg_val).val();
									value =  $(ID_Dlg_val).val().toString();  	// must be "toString()"
									break;
				case '#Defect_val': device_val.Defect = $(ID_Dlg_val).val();
									value = (device_val.Defect-1).toString();  	// must be "toString()"
									break;					
				case '#defect_pxl': device_val.Pxl = $(ID_Dlg_val).val();
									value = (device_val.Pxl-1).toString();  	// must be "toString()"
									break;					
				default : break;					
			}
			
			address =  obj_address;			// device_addr
			
			
			ID = '01';
			Command = '1';	
			socket_emit(ID, Command, address, value);
			//AckNack_Addr_Store(ID_Dlg_Ack);	
			
		});
		
		$( Dlg_right_bt ).mousedown(function() {
			
			timer = setInterval( function() {
			
				var current_val = parseInt( $( ID_Dlg_val ).val() );  
				current_val = current_val+1;
				
				if( current_val >= $( ID_Dlg_slider ).slider("option", "max") )
					current_val = $( ID_Dlg_slider ).slider("option", "max");
					
				$( ID_Dlg_val ).val(current_val);
				$( ID_Dlg_slider ).slider("value", current_val);
				//console.log('current_val = ' + current_val);
				$(ID_val).val( $(ID_Dlg_val).val() );	// main value display
				
				switch(ID_val) {
					case '#Feed_val':	device_val.Feed = $(ID_Dlg_val).val();
										break;
					case '#Defect_val': device_val.Defect = $(ID_Dlg_val).val();
										break;					
					case '#defect_pxl': device_val.Pxl = $(ID_Dlg_val).val();
										break;					
					default : break;					
				}
				
			}, 100);
			
		});
		// Feed, Defect Dlg right button END
				
		// Feed, Defect_Adv_Dlg Open(sub_dialog_2)========================
		$(ID_Dlg_Adv).click(function() {
			//$("span.ui-dialog-title").text(obj_title);						
			$(Adv_Dlg).dialog("open");
		});
					
		// Feed, Defect Dlg Ok START
		$( ID_Dlg_ok ).click(function() {
			
			ID = '01';
			Command = '1';	
			$(ID_val).val( $(ID_Dlg_val).val() );
			
			// value store
			switch(ID_val) {
				case '#Feed_val':	device_val.Feed = $(ID_Dlg_val).val();
									value =  $(ID_Dlg_val).val().toString();  	// must be "toString()"
									break;
				case '#Defect_val': device_val.Defect = $(ID_Dlg_val).val();
									value = (device_val.Defect-1).toString();  	// must be "toString()"
									break;					
				case '#defect_pxl': device_val.Pxl = $(ID_Dlg_val).val();
									value = (device_val.Pxl-1).toString();  	// must be "toString()"
									break;					
				default : break;					
			}
			
			address =  obj_address;			// device_addr
			socket_emit(ID, Command, address, value);
			//AckNack_Addr_Store(ID_Dlg_Ack);

		});
		// Feed,Defect Dlg Ok END
				
		// Feed,Defect Dlg Cancel
		$( ID_Dlg_cancel ).click(function() {
										
			$(ID_Dlg_val).val(obj_value_past);
			$( ID_Dlg_slider ).slider("value", obj_value_past );
			$( ID_val ).val( obj_value_past  );
			
			switch(ID_val) {
				case '#Feed_val':	device_val.Feed = $(ID_Dlg_val).val();
									value = obj_value_past.toString(); 	// must be "toString()"  	// must be "toString()"
									break;
				case '#Defect_val': device_val.Defect = $(ID_Dlg_val).val();
									value = (parseInt(obj_value_past)-1).toString(); 	// must be "toString()"
									break;					
				case '#defect_pxl': device_val.Pxl = $(ID_Dlg_val).val();
									value = (parseInt(obj_value_past)-1).toString(); 	// must be "toString()"
									break;					
				default : break;					
			}
			
			ID = '01';
			Command = '1';
			address = obj_address;				// device_addr
				
			socket_emit(ID, Command, address, value);
			
			//console.log(obj_address, $(ID_Dlg_val).val());
			
		});
		
		// Dialog dialogbeforeclose Event 
		$( ID_Dlg ).on( "dialogbeforeclose", function( event, ui ) {
						
			//console.log(this.id);
			//console.log(ID_val+'Dialog close');
			//console.log('value_past : '+obj_value_past);
			//console.log('value : '+obj_value);
		});   
	}
    		
	//"#Feed_val", "#Feed_Dlg", "#Feed_Dlg_val", "#Feed_Dlg_Arrow_bt_left", "#Feed_Dlg_Arrow_bt_right", "#Feed_Dlg_bt", #Feed_Dlg_slider, device_TEXT, device_val, device_addr, "#Feed_Adv_Dlg", "#Feed_Dlg_ok", "#Feed_Dlg_cancel", "#Feed_Dlg_Ack"
	var Dlg_feed = new ID_Dlg_Open_START( "#Feed_val", "#Feed_Dlg", "#Feed_Dlg_val", "#Feed_Dlg_Arrow_bt_left", "#Feed_Dlg_Arrow_bt_right", "#Feed_Dlg_Adv", "#Feed_Dlg_slider", "#Feed_Adv_Dlg", "#Feed_Dlg_ok", "#Feed_Dlg_cancel", "#Feed_Dlg_Ack" );
	var Dlg_defect = new ID_Dlg_Open_START( "#Defect_val", "#Defect_Dlg", "#Defect_Dlg_val", "#Defect_Dlg_Arrow_bt_left", "#Defect_Dlg_Arrow_bt_right", "#Defect_Dlg_Adv", "#Defect_Dlg_slider", "#Defect_Adv_Dlg", "#Defect_Dlg_ok", "#Defect_Dlg_cancel", "#Defect_Dlg_Ack" );
	var Dlg_defect_pxl = new ID_Dlg_Open_START( "#defect_pxl", "#Defect_Pxl_Dlg", "#Defect_Pxl_Dlg_val", "#Defect_Pxl_Dlg_Arrow_bt_left", "#Defect_Pxl_Dlg_Arrow_bt_right", "#Defect_Pxl_Dlg_Adv", "#Defect_Pxl_Dlg_slider", "#Defect_Pxl_Adv_Dlg", "#Defect_Pxl_Dlg_ok", "#Defect_Pxl_Dlg_cancel", "#Defect_Pxl_Dlg_Ack" );
			
	// Feed_Adv_Dlg feeder allocation information toggle ====================
	// feed1~feed4 [1st~3rd], feed5~feed8 [1st~3rd]
	var feed_allocation_info_1 	= 	{ 	feed_toggle_1:0, feed_toggle_2:0, 
										feed_toggle_3:0, feed_toggle_4:1
									};
									
	$( ".Adv_Feed_info_1" ).click(function() {
		
		// main page acknack
		// AckNack_Addr_Store( '#AckNack' );
		// device_addr_AckNack = '#AckNack';
		
		if( feed_allocation_info_1[this.id] == 0 ) {			// 2nd
			feed_allocation_info_1[this.id] = 1;
			$( "#"+this.id ).val("2ND");
		}	
		else if( feed_allocation_info_1[this.id] == 1 ) {		// 3rd
			feed_allocation_info_1[this.id] = 2;
			$( "#"+this.id ).val("3RD");
		}else{										// 1st
			feed_allocation_info_1[this.id] = 0;
			$( "#"+this.id ).val("1ST");
		}
		
		// console.log('Adv_Feed_info_1 Click this.id = ' + this.id);
		
		// feed4:feed3:feed2:feed1
		adv_feed_val.Feed_allocation_information_1  = feed_allocation_info_1.feed_toggle_1 
		+ feed_allocation_info_1.feed_toggle_2*4
		+ feed_allocation_info_1.feed_toggle_3*16 
		+ feed_allocation_info_1.feed_toggle_4*64;	
						
		address = adv_feed_addr.Feed_allocation_information_1;
		value =  adv_feed_val.Feed_allocation_information_1.toString();  // must be "toString()"
		ID = '01';
		Command = '4';	
		socket_emit(ID, Command, address, value);
		
	});
	
	var feed_allocation_info_2 = { 	feed_toggle_5:1, feed_toggle_6:2, 
									feed_toggle_7:2, feed_toggle_8:2
								};
	$( ".Adv_Feed_info_2" ).click(function() {
		
		// main page acknack
		// AckNack_Addr_Store( '#AckNack' );
		// device_addr_AckNack = '#AckNack';
		
		if( feed_allocation_info_2[this.id] == 0 ) {			// 2ND
			feed_allocation_info_2[this.id] = 1;
			$( "#"+this.id ).val("2ND");
		}	
		else if( feed_allocation_info_2[this.id] == 1 ) {		// 3rd
			feed_allocation_info_2[this.id] = 2;
			$( "#"+this.id ).val("3RD");
		} else {										// 1ST
			feed_allocation_info_2[this.id] = 0;
			$( "#"+this.id ).val("1ST");
		}
		
		// console.log('Adv_Feed_info_2 Click this.id = ' + this.id);
		
		// feed8:feed7:feed6:feed5
		adv_feed_val.Feed_allocation_information_2 = feed_allocation_info_2.feed_toggle_5 
		+ feed_allocation_info_2.feed_toggle_6*4
		+ feed_allocation_info_2.feed_toggle_7*16 
		+ feed_allocation_info_2.feed_toggle_8*64;			
				
		address = adv_feed_addr.Feed_allocation_information_2;
		value =  adv_feed_val.Feed_allocation_information_2.toString();  // must be "toString()"
		ID = '01';
		Command = '4';	
		socket_emit(ID, Command, address, value);	

	});
	
	// Feed_Adv_Dlg enable_disable toggle ====================
	$(".enable_disable").click( function() {
		// console.log( 'adv_feed_val[this.id] = ' + adv_feed_val[this.id] );
		if( adv_feed_val[this.id] == '0' ) {	// enable
			adv_feed_val[this.id] = '1';
			
			$( "#"+this.id ).css("background", "#D5FFE8");
			$( "#"+this.id ).val("ENABLE");
			// console.log('Enable');
												
		} else {								// disable
			adv_feed_val[this.id] = '0';
			$( "#"+this.id ).css("background", "#6DCBB0");
			$( "#"+this.id ).val("DISABLE");
					
			// console.log('Disable');
		}
		
		address = adv_feed_addr[this.id];
		value =  adv_feed_val[this.id];  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
	
	});
					
	// Feed_Adv_Dlg manual, auto toggle end====================
	$( "#Adv_feed_manual_auto" ).click(function() {
												
		if( adv_feed_val.Feed_mode == '1' ) {	// manual
			adv_feed_val.Feed_mode = '0';
			$( "#Adv_feed_manual_auto" ).css("background", "#6DCBB0");
			$( "#Adv_feed_manual_auto" ).find('label').html("MANUAL");			
			// console.log('manual');
		} else {						// auto
			adv_feed_val.Feed_mode = '1';

			$( "#Adv_feed_manual_auto" ).css("background", "#D5FFE8");
			$( "#Adv_feed_manual_auto" ).find('label').html("AUTO");			
			// console.log('auto');
		}
		
		address = adv_feed_addr.Feed_mode;
		value   = adv_feed_val.Feed_mode;  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
	
	});
	
	// Feed_Adv_Dlg individual button start====================
	$( ".feed_value_up" ).mouseup(function() {
		clearInterval(timer);
	});
	
	$( ".feed_value_up" ).mouseleave(function() {
		clearInterval(timer);
	});
	
	$( ".feed_value_up" ).mousedown(function() {
		var val_id = this.id.charAt(this.id.length-1);
		timer = setInterval( function() {
			adv_feed_id = "Feed_individual_"+val_id;
			var feed_individual_val = parseInt ($("#"+adv_feed_id).val() );	// Main Sub Dialog feed value read
			feed_individual_val += 1;
			if(feed_individual_val >= 15) feed_individual_val = 15;	// max is 15

			adv_feed_val[adv_feed_id] = feed_individual_val;	// value store
			$("#Adv_Feed_value").val(feed_individual_val);		// Sub Dialog
			$("#"+adv_feed_id).val(feed_individual_val);	// Main Sub Dialog
					
			address = adv_feed_addr[adv_feed_id];
			value =  feed_individual_val.toString();  // must be "toString()"
		}, 100);	
	});
	
	$( ".feed_value_up" ).click(function() {
		var val_id = this.id.charAt(this.id.length-1);
		adv_feed_id = "Feed_individual_"+val_id;
		var feed_individual_val = parseInt ($("#"+adv_feed_id).val() );	// Main Sub Dialog feed value read
		feed_individual_val += 1;
		if(feed_individual_val >= 15) feed_individual_val = 15;	// max is 15

		adv_feed_val[adv_feed_id] = feed_individual_val;	// value store
		$("#Adv_Feed_value").val(feed_individual_val);		// Sub Dialog
		$("#"+adv_feed_id).val(feed_individual_val);	// Main Sub Dialog
				
		address = adv_feed_addr[adv_feed_id];
		value =  feed_individual_val.toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
		// AckNack_Addr_Store("#Adv_Feed_AckNack");
	
	});
					
	$( ".feed_value_down" ).mouseup(function() {
		clearInterval(timer);
	});
	
	$( ".feed_value_down" ).mouseleave(function() {
		clearInterval(timer);
	});
	
	$( ".feed_value_down" ).mousedown(function() {
		var val_id = this.id.charAt(this.id.length-1);
		timer = setInterval(function() {
			adv_feed_id = "Feed_individual_"+val_id;
			var feed_individual_val = parseInt ($("#"+adv_feed_id).val() );	// Main Sub Dialog feed value read
			feed_individual_val -= 1;
			if(feed_individual_val <= 0) feed_individual_val = 0;	// min is 0
			
			adv_feed_val[adv_feed_id] = feed_individual_val;	// value store
			// $("#Adv_Feed_value").val(feed_individual_val);		// Sub Dialog
			$("#"+adv_feed_id).val(feed_individual_val);		// Main Sub Dialog
		}, 100);
	});
	
	$( ".feed_value_down" ).click(function() {
		// //console.log('charAt: ' + this.id.charAt(this.id.length-1));
		var val_id = this.id.charAt(this.id.length-1);
		adv_feed_id = "Feed_individual_"+val_id;
		var feed_individual_val = parseInt ($("#"+adv_feed_id).val() );	// Main Sub Dialog feed value read
		feed_individual_val -= 1;
		if(feed_individual_val <= 0) feed_individual_val = 0;	// min is 0
		
		adv_feed_val[adv_feed_id] = feed_individual_val;	// value store
		$("#Adv_Feed_value").val(feed_individual_val);		// Sub Dialog
		$("#"+adv_feed_id).val(feed_individual_val);		// Main Sub Dialog
		
		address = adv_feed_addr[adv_feed_id];
		value =  feed_individual_val.toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
		
		// AckNack_Addr_Store("#Adv_Feed_AckNack");
		
	});
	// Feed_Adv_Dlg individual button end====================
	
	// RGB Dialog Start
	$("#RGB_ONOFF").click(function() {
		
		if ( device_val[current_rgb_dialog_state+"_ON"] == 1 ) {
			device_val[current_rgb_dialog_state+"_ON"] = 0;
			$("#RGB_ONOFF").css("background", "#6DCBB0");
			$("#RGB_ONOFF").html("OFF");
			$("#"+current_rgb_dialog_state).css("border", "2px solid #6BBA96");
		} else {
			device_val[current_rgb_dialog_state+"_ON"] = 1;
			$("#RGB_ONOFF").css("background", "#D5FFE8");
			$("#RGB_ONOFF").html("ON");
			$("#"+current_rgb_dialog_state).css("border", "2px solid #D5FFE8");
		}
			
		//console.log('this rgb state: ' + current_rgb_dialog_state);
		//console.log(current_rgb_dialog_state +' data : '+device_val[current_rgb_dialog_state+"_ON"]);
		//device_val[current_rgb_dialog_state+"_ON"] = 1;
		
		address = device_addr[current_rgb_dialog_state+"_ON"];
		value =  device_val[current_rgb_dialog_state+"_ON"].toString();  // must be "toString()"
		Command = '1';	
		//console.log('address: '+address + ' value: ' + value);
		socket_emit(ID, Command, address, value);
	});
	
	$(".RGB_val").click(function() {
						
		//console.log('RGB_val : ' + this.id);
		All_Dialog_Close();
		current_rgb_dialog_state = this.id;		// click ID store (BDS ~ )
		
		// RGB ONOFF Button init
		if ( device_val[current_rgb_dialog_state+"_ON"] == 1 ) {
			$("#RGB_ONOFF").html("ON");
			$("#RGB_ONOFF").css("background", "#D5FFE8");
		} else {
			$("#RGB_ONOFF").html("OFF");
			$("#RGB_ONOFF").css("background", "#6DCBB0");
		}
		
		//$("span.ui-dialog-title").text(device_TEXT[this.id]);	// title change
		$("#RGB_Dlg").dialog({title: device_TEXT[this.id]});	// title change
		$("#"+this.id).val(device_val[this.id]);				// HTML value

		device_val[this.id+"_past"] = $("#"+this.id).val();		// HTML past value
												
		$( "#RGB_Dlg_val" ).val( device_val[this.id] );				// past value display
		$( "#RGB_Dlg_slider" ).slider("value", device_val[this.id]);	// past value display to slider	
		
		//console.log('device_val.B_D_S_past = ' + device_val[this.id]); 
				
		$( "#RGB_Dlg" ).dialog( "open" );
	    
	});
		
	$( "#RGB_Dlg_slider" ).slider({
		slide: function( event, ui ) {
			$( "#RGB_Dlg_val" ).val( ui.value );
			device_val[current_rgb_dialog_state] = ui.value;
		}
	});
	
	$("#RGB_Dlg_Arrow_bt_left").mouseup(function() {
		
		clearInterval(timer);

	});
	
	$("#RGB_Dlg_Arrow_bt_left").mouseleave(function() {
		clearInterval(timer);
	});
	
	$("#RGB_Dlg_Arrow_bt_left").mousedown(function() {
	
		timer = setInterval(function(){ 
			
			device_val[current_rgb_dialog_state] = parseInt(device_val[current_rgb_dialog_state]) - 1;

			if( device_val[current_rgb_dialog_state] <= $( "#RGB_Dlg_slider" ).slider("option", "min") )
				device_val[current_rgb_dialog_state] = $( "#RGB_Dlg_slider" ).slider("option", "min");
				
			$( "#RGB_Dlg_val" ).val(device_val[current_rgb_dialog_state]);
			$( "#RGB_Dlg_slider" ).slider("value", device_val[current_rgb_dialog_state]);
			//console.log('current_val = ' + device_val[current_rgb_dialog_state]);

			$("#"+current_rgb_dialog_state).val( $("#RGB_Dlg_val").val() );		// main value display

		}, 100);	
		
	});
	
	$("#RGB_Dlg_Arrow_bt_left").click(function() {
			
		device_val[current_rgb_dialog_state] = parseInt(device_val[current_rgb_dialog_state]) - 1;

		if( device_val[current_rgb_dialog_state] <= $( "#RGB_Dlg_slider" ).slider("option", "min") )
			device_val[current_rgb_dialog_state] = $( "#RGB_Dlg_slider" ).slider("option", "min");
			
		$( "#RGB_Dlg_val" ).val(device_val[current_rgb_dialog_state]);
		$( "#RGB_Dlg_slider" ).slider("value", device_val[current_rgb_dialog_state]);
		//console.log('current_val = ' + device_val[current_rgb_dialog_state]);

		$("#"+current_rgb_dialog_state).val( $("#RGB_Dlg_val").val() );		// main value display
		
		
		//address = current_adv_rgb_address;
		address = device_addr[current_rgb_dialog_state];
		value =  device_val[current_rgb_dialog_state].toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		//console.log('address: '+address + ' value: ' + value);
		socket_emit(ID, Command, address, value);
	
		// AckNack_Addr_Store("#AckNack");
	});
	
	$("#RGB_Dlg_Arrow_bt_right").mouseup(function() {
		clearInterval(timer);
		
		address = device_addr[current_rgb_dialog_state];
		value =  device_val[current_rgb_dialog_state].toString();  // must be "toString()"
		
		ID = '01';
		Command = '1';	
		//console.log('address: '+address + ' value: ' + value);
		socket_emit(ID, Command, address, value);
		// AckNack_Addr_Store("#AckNack");
	});
	
	$("#RGB_Dlg_Arrow_bt_right").mouseleave(function() {
		clearInterval(timer);
	});
	
	$("#RGB_Dlg_Arrow_bt_right").mousedown(function() {
		timer = setInterval(function() {
		
			device_val[current_rgb_dialog_state] = parseInt(device_val[current_rgb_dialog_state]) + 1;

			if( device_val[current_rgb_dialog_state] >= 200 )
				device_val[current_rgb_dialog_state] = 200;
				
			$( "#RGB_Dlg_val" ).val(device_val[current_rgb_dialog_state]);
			$( "#RGB_Dlg_slider" ).slider("value", device_val[current_rgb_dialog_state]);
			//console.log('current_val = ' + device_val[current_rgb_dialog_state]);

			$("#"+current_rgb_dialog_state).val( $("#RGB_Dlg_val").val() );		// main value display
		
		}, 100);
	});
	
	
	$("#RGB_Dlg_Arrow_bt_right").click(function() {
	
		device_val[current_rgb_dialog_state] = parseInt(device_val[current_rgb_dialog_state]) + 1;

		if( device_val[current_rgb_dialog_state] >= 200 )
			device_val[current_rgb_dialog_state] = 200;
			
		$( "#RGB_Dlg_val" ).val(device_val[current_rgb_dialog_state]);
		$( "#RGB_Dlg_slider" ).slider("value", device_val[current_rgb_dialog_state]);
		//console.log('current_val = ' + device_val[current_rgb_dialog_state]);

		$("#"+current_rgb_dialog_state).val( $("#RGB_Dlg_val").val() );		// main value display
		
		//address = current_adv_rgb_address;
		address = device_addr[current_rgb_dialog_state];
		value =  device_val[current_rgb_dialog_state].toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		//console.log('address: '+address + ' value: ' + value);
		socket_emit(ID, Command, address, value);
	
		//AckNack_Addr_Store("#AckNack");
		
	});
	
	$("#RGB_Dlg_ok").click(function() {
		 
		device_val[current_rgb_dialog_state] = $("#RGB_Dlg_val").val();
		$("#"+current_rgb_dialog_state).val( $("#RGB_Dlg_val").val() );
		
		address = device_addr[current_rgb_dialog_state];	// current_rgb_dlg_state(BDS~RLC)
		value =  $('#'+current_rgb_dialog_state).val();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);

		// AckNack_Addr_Store("#RGB_Dlg_Ack");
	});
						
	$("#RGB_Dlg_cancel").click(function() {
		device_val[current_rgb_dialog_state] = device_val[current_rgb_dialog_state+'_past'];
		$( "#"+current_rgb_dialog_state ).val(device_val[current_rgb_dialog_state+'_past'] );	// main rgb value
		$( "#RGB_Dlg_slider" ).slider("value", device_val[current_rgb_dialog_state+'_past'] );	// rgb dlg slider value
		$( "#RGB_Dlg_val" ).val( device_val[current_rgb_dialog_state+'_past'] );	// rgb dlg value
		
		address = device_addr[current_rgb_dialog_state];					// current_rgb_dlg_state(BDS~RLC)
		value =  device_val[current_rgb_dialog_state+'_past'].toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
	});
		
	// 1ST / 2ND / 3rd rgb sensitivity	
	$("#RGB_Dlg_Adv").click(function() {

		//console.log('("#RGB_Dlg_Adv").click - current_rgb_dialog_state: '+current_rgb_dialog_state);
		
		// Current address, value, title text store		
		adv_rgb_addr = Camaddr[current_rgb_dialog_state];
		adv_rgb_val = Camaddr_val[current_rgb_dialog_state];
							
		// Adv_camera_value init , adv_rgb_val.a0~a8
		for(var i=1; i<9; i++) {
						
			/* value init start*/
			$("#a"+i).val(adv_rgb_val['a'+i].toFixed(1));
			$("#b"+i).val(adv_rgb_val['b'+i].toFixed(1));
			/* value init end*/
		}
		$( "#Camera_Adv_Dlg" ).dialog({title:device_TEXT[current_rgb_dialog_state]});
		$( "#Camera_Adv_Dlg" ).dialog( "open" );	
	});
	
	$(".adv_cam_value_up").mouseup(function() {
		clearInterval(timer);
	});
	
	
	$(".adv_cam_value_up").mouseleave(function() {
		clearInterval(timer);
	});
	
	// Camera_Adv_Dlg individual Button ====================
	$(".adv_cam_value_up").mousedown(function() {
		
		adv_rgb_id = this.id.slice(this.id.length-2, this.id.length);
		timer = setInterval(function() {
			
			// display value
			adv_rgb_val[adv_rgb_id] += 0.2;
			adv_rgb_val[adv_rgb_id] = parseFloat( adv_rgb_val[adv_rgb_id].toFixed(1) );
			
			if(adv_rgb_val[adv_rgb_id] >= 20.0) adv_rgb_val[adv_rgb_id] = 20.0;	// max is 20.0
			
			$("#"+adv_rgb_id).val(adv_rgb_val[adv_rgb_id].toFixed(1));			// main sub display
					
			
		}, 100);
			
	});
	
	$(".adv_cam_value_up").click(function() {
		//console.log('up click');
		adv_rgb_id = this.id.slice(this.id.length-2, this.id.length);
		
		// display value
		adv_rgb_val[adv_rgb_id] += 0.2;
		adv_rgb_val[adv_rgb_id] = parseFloat( adv_rgb_val[adv_rgb_id].toFixed(1) );
		
		if(adv_rgb_val[adv_rgb_id] >= 20.0) adv_rgb_val[adv_rgb_id] = 20.0;	// max is 20.0
		
		$("#"+adv_rgb_id).val(adv_rgb_val[adv_rgb_id].toFixed(1));			// main sub display
		
		var rgb_transmit_value = ((adv_rgb_val[adv_rgb_id]+20)*5);

		address = adv_rgb_addr[adv_rgb_id];
		value =  rgb_transmit_value.toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);			
	});
	
	$(".adv_cam_value_down").mouseup(function() {
		clearInterval(timer);
	});
	
	
	$(".adv_cam_value_down").mouseleave(function() {
		clearInterval(timer);		
	});
	
	$(".adv_cam_value_down").mousedown(function() {
		
		adv_rgb_id = this.id.slice(this.id.length-2, this.id.length);
		timer = setInterval(function() {
			
			// display value
			adv_rgb_val[adv_rgb_id] -= 0.2;
			adv_rgb_val[adv_rgb_id] = parseFloat( adv_rgb_val[adv_rgb_id].toFixed(1) );
			
			if(adv_rgb_val[adv_rgb_id] <= -20.0) adv_rgb_val[adv_rgb_id] = -20.0;	// min is 20.0
								
			$("#"+adv_rgb_id).val(adv_rgb_val[adv_rgb_id].toFixed(1));				// main sub display

		}, 100);

	});
	
	$(".adv_cam_value_down").click(function() {
		//console.log('down click');
		adv_rgb_id = this.id.slice(this.id.length-2, this.id.length);
		// //console.log( 'this.id: '+this.id.slice(this.id.length-2, this.id.length) );
		
		// display value
		adv_rgb_val[adv_rgb_id] -= 0.2;
		adv_rgb_val[adv_rgb_id] = parseFloat( adv_rgb_val[adv_rgb_id].toFixed(1) );
		
		if(adv_rgb_val[adv_rgb_id] <= -20.0) adv_rgb_val[adv_rgb_id] = -20.0;	// min is 20.0
							
		$("#"+adv_rgb_id).val(adv_rgb_val[adv_rgb_id].toFixed(1));				// main sub display
		
		var rgb_transmit_value = ((adv_rgb_val[adv_rgb_id]+20)*5);
		
		address = adv_rgb_addr[adv_rgb_id];
		value =  rgb_transmit_value.toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);	
	});	// Camera_Adv_Dlg individual Button ====================	
	
	// START Menu => EJECTING ===============================
	// Adv_ejecting_value_down click event: delay 1~3, head 1~3, hold 1~3
	$(".ejecting_control_btn_d").mouseup(function() {
		clearInterval(timer);
	});
	
	$(".ejecting_control_btn_d").mouseleave(function() {
		clearInterval(timer);
	});
	
	$(".ejecting_control_btn_d").mousedown(function() {
		adv_ejecting_id = this.id.slice(0, this.id.length-2);
		var ejecting_number = adv_ejecting_id.charAt(adv_ejecting_id.length - 1);
		var n = adv_ejecting_id.search('_');			// '_' search 
		var current_id = adv_ejecting_id.slice(0, n);	// ID slice( delay, hold )
		
		timer = setInterval( function() {
			ejecting_val[adv_ejecting_id] -= 1;
			if( ejecting_val[adv_ejecting_id] <= 0 ) ejecting_val[adv_ejecting_id] = 0; // min is 0
			switch(current_id) {
				
				case 'hold': 	if( ejecting_val[adv_ejecting_id] <= ejecting_val['head_val_'+ejecting_number]) ejecting_val[adv_ejecting_id] = ejecting_val['head_val_'+ejecting_number]+1; // max is 255
								break;		
				default: break;
			}
				
			$("#"+adv_ejecting_id).val( ejecting_val[adv_ejecting_id] );		// dialog value display
			
		}, 100);
	});
	
	$(".ejecting_control_btn_d").click(function() {
		
		adv_ejecting_id = this.id.slice(0, this.id.length-2);		
		var ejecting_number = adv_ejecting_id.charAt(adv_ejecting_id.length - 1);
		var n = adv_ejecting_id.search('_');			// '_' search 
		var current_id = adv_ejecting_id.slice(0, n);	// ID slice( delay, hold )
		
		ejecting_val[adv_ejecting_id] = ejecting_val[adv_ejecting_id] - 1;
		
		if( ejecting_val[adv_ejecting_id] <= 0 ) ejecting_val[adv_ejecting_id] = 0; // min is 0								
		switch(current_id) {
			
			case 'hold': 	if( ejecting_val[adv_ejecting_id] <= ejecting_val['head_val_'+ejecting_number]) ejecting_val[adv_ejecting_id] = ejecting_val['head_val_'+ejecting_number]+1; // max is 255
							break;		
			default: break;
		}
		
		$("#"+adv_ejecting_id).val( ejecting_val[adv_ejecting_id] );		// dialog value display
		
		address = ejecting_addr[adv_ejecting_id];
		value =  ejecting_val[adv_ejecting_id].toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
		
	});
	
	// Adv_ejecting_value_up click event: delay 1~3, hold 1~3	
	$(".ejecting_control_btn_u").mouseup(function() {
		clearInterval(timer);
	});
	
	$(".ejecting_control_btn_u").mouseleave(function() {
		clearInterval(timer);
	});
	
	$(".ejecting_control_btn_u").mousedown(function() {
		adv_ejecting_id = this.id.slice(0, this.id.length-2);
		var ejecting_number = adv_ejecting_id.charAt(adv_ejecting_id.length - 1);
		var n = adv_ejecting_id.search('_');			// '_' search 
		var current_id = adv_ejecting_id.slice(0, n);	// ID slice( delay, hold )
				
		timer = setInterval(function() {
				ejecting_val[adv_ejecting_id] += 1;
			
				switch(current_id) {
					case 'delay':	if( ejecting_val[adv_ejecting_id] >= 100 ) ejecting_val[adv_ejecting_id] = 100; // max is 100 	
									break;
					case 'head': 	if( ejecting_val[adv_ejecting_id] >= 255 ) ejecting_val[adv_ejecting_id] = 255; // max is 255
									if( ejecting_val[adv_ejecting_id] >= ejecting_val['hold_val_'+ejecting_number]) ejecting_val[adv_ejecting_id] = ejecting_val['hold_val_'+ejecting_number]-1;
									break;
					case 'hold': 	if( ejecting_val[adv_ejecting_id] >= 255 ) ejecting_val[adv_ejecting_id] = 255; // max is 255
									break;		
					default: break;
				}
							
				$("#"+adv_ejecting_id).val( ejecting_val[adv_ejecting_id] );		// dialog value display
			}, 100);
	});
	
	$(".ejecting_control_btn_u").click(function() {
		
		adv_ejecting_id = this.id.slice(0, this.id.length-2);
		ejecting_val[adv_ejecting_id] += 1;
		var ejecting_number = adv_ejecting_id.charAt(adv_ejecting_id.length - 1);
		var n = adv_ejecting_id.search('_');			// '_' search 
		var current_id = adv_ejecting_id.slice(0, n);	// ID slice( delay, hold )
		
		switch(current_id) {
			case 'delay':	if( ejecting_val[adv_ejecting_id] >= 100 ) ejecting_val[adv_ejecting_id] = 100; // max is 100 	
							break;
			case 'head': 	if( ejecting_val[adv_ejecting_id] >= 255 ) ejecting_val[adv_ejecting_id] = 255; // max is 255
							if( ejecting_val[adv_ejecting_id] >= ejecting_val['hold_val_'+ejecting_number]) {
								ejecting_val[adv_ejecting_id] = ejecting_val['hold_val_'+ejecting_number]-1;
							}
							break;
			case 'hold': 	if( ejecting_val[adv_ejecting_id] >= 255 ) ejecting_val[adv_ejecting_id] = 255; // max is 255
							break;		
			default: break;
		}
			
		$("#"+adv_ejecting_id).val( ejecting_val[adv_ejecting_id] );		// dialog value
				
		address = ejecting_addr[adv_ejecting_id];
		value =  ejecting_val[adv_ejecting_id].toString();  // must be "toString()"
		ID = '01';
		Command = '1';	
		socket_emit(ID, Command, address, value);
	});		// ====================================================
	
	/* 
	* Cleaning Click Event Start  
	* Cleaning Object 
	* Auto : 0x01(enable, default) / 0x00(disable)
	* Cycle: 1 ~ 255 (init.: 60)
	* Manual: 0x00(off, default) / 0x01(on)		
	*/
	$("#clean-auto-btn").click( function() {
		
		if( cleaning_val.Auto == 1 ) {	// auto disable
			cleaning_val.Auto = 0;
			$('#'+this.id).css("background", "#04B486");
			$('#'+this.id).html('DISABLE');
		}else {		// auto Enable					
			cleaning_val.Auto = 1; 
			$('#'+this.id).css("background", "#D5FFE8")
			$('#'+this.id).html('ENABLE');
		}
		
		Command = '1';
		address = cleaning_addr.Auto;			// cleaning Auto addrss
		value = cleaning_val.Auto.toString();	// must be toString()
		socket_emit(ID, Command, address, value);	
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
	});
	
	
	$(".Cleaning_cycle_bt").mouseup( function() {	
		
		clearInterval(timer);
		
		Command = '1';
		address = cleaning_addr.Cycle;			// cleaning Auto addrss
		value = cleaning_val.Cycle.toString();	// must be toString()
		socket_emit(ID, Command, address, value);	
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
		
	});
	
	// Cycle value UP and DOWN, min:1 max:255
	$(".Cleaning_cycle_bt").mousedown( function() {	
		//console.log(this.id);
		var click_id = this.id;
		timer = setInterval( function() {
			switch( click_id ) {
				case 'Cleaning_cycle_value_down': 	cleaning_val.Cycle -= 1;
													if( cleaning_val.Cycle <= 1 ) cleaning_val.Cycle = 1;
													break;
				case 'Cleaning_cycle_value_up':		cleaning_val.Cycle += 1;
													if( cleaning_val.Cycle >= 255 ) cleaning_val.Cycle = 255;
													break;
			}
			
			$("#Cycle").val(cleaning_val.Cycle);
		}, 70);
				
	});
	
	// Cleaning Manual
	$("#clean-title-manual").click( function() {
		
		if( cleaning_val.Manual == 1 ) {	// Manual on
			cleaning_val.Manual = 0;
			$('#'+this.id).css("background", "#04B486");			
			$('#clean-title-manual').html("OFF");			
		}else {		// Manual off
			cleaning_val.Manual = 1;
			$('#'+this.id).css("background", "#D5FFE8");
			$('#clean-title-manual').html("ON");
		}
	
		/*
		var cleaning_states = { feed_off:0, eject_off:1, };
		function cleaning_machine() {
			feed_on_off(0);
			eject_on_off(0);
			mode_ena_disable_check();
		}
		*/
		
		Command = '1';
		address = cleaning_addr.Manual;			// cleaning Manual addrss
		value = cleaning_val.Manual.toString();	// must be toString()
		socket_emit(ID, Command, address, value);	
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
		
	});
	/* Cleaning Click Event End */
	
	/* Lighting Click event Start */ 
	/*
	// avr <-> node test event
	$(".light_all_bt").click( function(){
		// console.log(this.id);
		
		switch(this.id) {
		
			case 'all_on':	
					
					for (var key in lighting_addr) {
						if( lighting_addr[key] < '0x306' ) {
							lighting_val[key] = 255;
							Command = '1';
							address = lighting_addr[key];
							value = lighting_val[key].toString();	// must be toString()
							socket_emit(ID, Command, address, value);			
							$(ID_lighting_val[key]).html('ON').css('background', '#D5FFE8');
						}
					}
					break;
					
			case 'all_off':
					
					for (var key in lighting_addr) {
						if( lighting_addr[key] < '0x306' ) {
							lighting_val[key] = 0;
							Command = '1';
							address = lighting_addr[key];
							value = lighting_val[key].toString();	// must be toString()
							socket_emit(ID, Command, address, value);			
							$(ID_lighting_val[key]).html('OFF').css('background', '#6DCBB0');
						} 
					}
					break;
		
			default: break;
		}
		
	});
	*/
	
	$(".light_on_bt").click( function(){
		//console.log(this.id);
		
		if( lighting_val[this.id] == 0 ) {	// on
			lighting_val[this.id] = 255;
			$(ID_lighting_val[this.id]).html('ON').css('background', '#D5FFE8');			
		} else {	// off
			lighting_val[this.id] = 0;
			$(ID_lighting_val[this.id]).html('OFF').css('background', '#6DCBB0');
		}
		
		Command = '1';
		address = lighting_addr[this.id];
		value = lighting_val[this.id].toString();	// must be toString()
		socket_emit(ID, Command, address, value);	
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
	});
	
	
	$(".light_val_bt").mouseleave( function(){
		//console.log(this.id);
		clearInterval(light_timer);		
	});
	
	$(".light_val_bt").mouseup( function(){
		
		clearInterval(light_timer);	
		var device_val = this.id.slice(14);
		
		Command = '1';
		address = lighting_addr['light_val_'+device_val];
		value = lighting_val['light_val_'+device_val].toString();	// must be toString()
		socket_emit(ID, Command, address, value);	
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
		
	});
	
	$(".light_val_bt").mousedown( function(){
			
		var up_down = this.id.charAt(12);
		var device_val = this.id.slice(14);
		// //console.log(id_val);
				
		light_timer = setInterval( function() {
							
			switch(up_down) {
				
				// down
				case 'd':

					lighting_val['light_val_'+device_val] = parseInt(lighting_val['light_val_'+device_val])-1;
					if (lighting_val['light_val_'+device_val] <=0 ) {
						lighting_val['light_val_'+device_val] = 0;
					}
					break;
				// up		
				case 'u':
					
					lighting_val['light_val_'+device_val] = parseInt(lighting_val['light_val_'+device_val])+1;
					if (lighting_val['light_val_'+device_val] >=100 ) {
						lighting_val['light_val_'+device_val] = 100;
					}
					break;		
			}
			
			$("#light_val_"+device_val).val(lighting_val['light_val_'+device_val]);
			
		}, 70);		
		
		
	});
	
	$(".light_val_bt").click( function(){
			
		var up_down = this.id.charAt(12);
		var device_val = this.id.slice(14);
		// //console.log(id_val);
				
		switch(up_down) {
			
			// down
			case 'd':

				lighting_val['light_val_'+device_val] = parseInt(lighting_val['light_val_'+device_val])-1;
				if (lighting_val['light_val_'+device_val] <=0 ) {
					lighting_val['light_val_'+device_val] = 0;
				}
				break;
			// up		
			case 'u':
				
				lighting_val['light_val_'+device_val] = parseInt(lighting_val['light_val_'+device_val])+1;
				if (lighting_val['light_val_'+device_val] >=100 ) {
					lighting_val['light_val_'+device_val] = 100;
				}
				break;		
		}
		
		$("#light_val_"+device_val).val(lighting_val['light_val_'+device_val]);
		
		Command = '1';
		address = lighting_addr['light_val_'+device_val];
		value = lighting_val['light_val_'+device_val].toString();	// must be toString()
		socket_emit(ID, Command, address, value);	
			
	});
	/* Lighting Click event End */ 
	
	/* Camera on off event Start */
	$('.camera_onoff').click(function() {
		
		var bit_decimal = [1, 2, 4, 8, 16, 32, 64, 128];
			
		if( $('#'+this.id ).val() == 1 ) {	// change off
			$('#'+this.id ).val(0);
			$('#'+this.id ).css('background', '#6DCBB0');
			$('#'+this.id ).html('OFF');
		} else {	// change on
			$('#'+this.id ).val(1);
			$('#'+this.id ).css('background', '#D5FFE8');
			$('#'+this.id ).html('ON');
		}
		
		value = 0;
		if( this.id.slice(7) <= 'a8') {
			//console.log('a8 >= a'+parseInt(this.id.slice(8)));
			address = camera_onoff_addr.rgb_A;
			
			for( var i=0; i<8; i++) {
				value += $('#camera_a'+(i+1)).val() * bit_decimal[i];
			}	
			//console.log('camera_a value = ' + value);
		}	
		else {
			//console.log('b1 <= b'+parseInt(this.id.slice(8)));
			address = camera_onoff_addr.rgb_B;
			
			for( var i=0; i<8; i++) {
				value += $('#camera_b'+(i+1)).val() * bit_decimal[i];
			}	
			//console.log('camera_b value = ' + value);
		}	
		
		Command = '1';
		value = value.toString();
		socket_emit(ID, Command, address, value);	
		
		// main page acknack
		//AckNack_Addr_Store( '#AckNack' );
		//device_addr_AckNack = '#AckNack';
		
		delete bit_decimal;
		bit_decimal.length = 0;
		
	});
	/* Camera on off event End */
	
	// Ack event
	socket.on('Ack', function(data) {
		
		AckNack = ACK;
		
		// debug // console.log('ACK : '+data.message);
		//$(device_addr_AckNack).val("ACK");
		//$(device_addr_AckNack).css("background", "#9FF781");
		//timer = setInterval(AckNack_Check_Func, 500);
		
	});
	
	// Nack event
	socket.on('Nack', function(data) {
		
		AckNack = NACK;
		// debug // console.log('NACK : '+data.message);
		
		// socket_emit(ID, Command, nack_addr, nack_value);
		//$(device_addr_AckNack).val("NACK");
		//$(device_addr_AckNack).css("background", "red");
							
	});		
	
	var protocol_HTML_server = { ID:'01', Command:'0', device_address:'0x000',  value :'00',
                                 device_object: "device_val_1", device_key :'0',ID_device_value:'0'};
								 
	//  command 2: Read Avr Value
	socket.on('read_avr_val_response', function(data) {
		addr_read_cnt++;
		//console.log('read_avr_val_response data: ' + data.value);
		
		device_object_val = device_objects[protocol_HTML_server.device_object];
		device_object_val[protocol_HTML_server.device_key] = data.value;
		// device object store
		
		/*
		// ex) data = 00x or 0xx, zero remove
		if( data.value > 10 && data.value <= 100 ) data.value = data.value.slice(1);
		else if ( data.value < 10 ) data.value = data.value[2];
		*/
		
		// $(protocol_HTML_server.ID_device_value).val(data.value);	// device object store
		
		//console.log('device_object_val[protocol_HTML_server.device_key]: ' + device_object_val[protocol_HTML_server.device_key] );
		//console.log(protocol_HTML_server.device_key + ' ' + data.value);
		
        avr_addrs.push(data.value.slice(0,5));
        avr_datas.push(data.value.slice(5));
		avr_data.push(data.value);
		
		//if( '0x403' == data.value.slice(0,5) ) {
		if( '0x10A' == data.value.slice(0,5) ) {
			
			// debug console
			/*
			console.log('0x10A if syntax');
			console.log('addr_read_cnt : ' + addr_read_cnt);
			console.log('avr_data.length : ' + avr_data.length);
			console.log('avr_addrs.length : ' + avr_addrs.length);
			console.log('avr_datas.length : ' + avr_datas.length);
			console.log('avr_data_read_complite');
			*/
			
			avr_data_to_init_html();	// htmi display init
			
			addr_read_cnt = avr_datas.length = avr_addrs.length = avr_data.length = 0;
			
		}
	
	});
	
	function avr_data_to_init_html() {
		
		// debug
		// console.log('avr init func ..');	
		// console.log('avr_addrs[4] : ' + avr_addrs[4]+':'+avr_addrs[4].length);
						
		for(var i=0; i<avr_addrs.length; i++) {
			// console.log('avr_addrs : ' + avr_addrs[i]);
			// console.log('avr_address: '+ avr_addrs[i] + ' data : ' + avr_datas[i]);
			
			// mode name read
			if( avr_addrs[i] >= '0x020' && avr_addrs[i] <= '0x033') {
				mode_name_val.mode_1+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x034' && avr_addrs[i] <= '0x047' ) {
				mode_name_val.mode_2+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x048' && avr_addrs[i] <= '0x05b' ) {
				mode_name_val.mode_3+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x05c' && avr_addrs[i] <= '0x06f' ) {
				mode_name_val.mode_4+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x070' && avr_addrs[i] <= '0x083' ) {
				mode_name_val.mode_5+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x084' && avr_addrs[i] <= '0x097' ) {
				mode_name_val.mode_6+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x098' && avr_addrs[i] <= '0x0ab' ) {
				mode_name_val.mode_7+=(avr_datas[i]+', ');
			} else if( avr_addrs[i] >= '0x0ac' && avr_addrs[i] <= '0x0bf' ) {
				mode_name_val.mode_8+=(avr_datas[i]+', ');
				
			} else if( avr_addrs[i] == '0x005' ) {		// mode value
				
				// MODE INIT
				mode_val.mode = parseInt(avr_datas[i], 10);
				// debug
				// console.log('mode value: '+mode_val.mode);
				
			} else if( avr_addrs[i] == '0x002' ) {	// model nir, stage, channel
				
				//console.log('model value : ' + avr_datas[i]);
				model_val['nir'] = parseInt(avr_datas[i], 10);
				model_val['stage'] = parseInt(avr_datas[i], 10);
				model_val['channel'] = parseInt(avr_datas[i], 10);
				
			} else if( avr_addrs[i] == '0x003' ) {	// feed_allocation_info_1
				//console.log('feed_allocation_info_1');
				adv_feed_val.Feed_allocation_information_1 = parseInt(avr_datas[i], 10);
			} else if( avr_addrs[i] == '0x004' ) {	// feed_allocation_info_2
				//console.log('feed_allocation_info_2');
				adv_feed_val.Feed_allocation_information_2 = parseInt(avr_datas[i], 10);
			} else if( (avr_addrs[i] == '0x400') || (avr_addrs[i] == '0x401')) {
				// model camera rgb a, b video select
				//console.log('model value : ' + avr_datas[i]);
				for(var key in model_addr) {
					if ( model_addr[key] == avr_addrs[i] ) {
						model_val[key] = parseInt(avr_datas[i], 10);
						//console.log(model_addr[key]+':'+model_val[key]);
					}	
				}
				
			} else if ( avr_addrs[i] >= '0x200' && avr_addrs[i] <= '0x214') {
				
				if ( avr_addrs[i] >= '0x20A' && avr_addrs[i] <= '0x20C') {
					// feed value 1,2,3 
					var addr = avr_addrs[i];
					switch(addr) {
						
						case '0x20A':	device_val_1.Feed = parseInt(avr_datas[i], 10);
										//console.log('device_val_1.Feed : '+':'+device_val_1.Feed);
										break;
						case '0x20B':	device_val_2.Feed = parseInt(avr_datas[i], 10);
										//console.log('device_val_2.Feed : '+device_val_2.Feed);
										break;
						case '0x20C':	device_val_3.Feed = parseInt(avr_datas[i], 10);
										//console.log('device_val_3.Feed : '+device_val_3.Feed);
										break;
						default: break;				
					
					}
					
				} else if(avr_addrs[i] == '0x201') {
					for(var key in Eject_Feed_onoff_addr) {
						if ( Eject_Feed_onoff_addr[key] == avr_addrs[i] ) {
							Eject_Feed_onoff_val[key] = parseInt(avr_datas[i], 10);
							// console.log(Eject_Feed_onoff_addr[key]+':'+Eject_Feed_onoff_val[key]);
						}	
					}
				}
				else {
					for(var key in adv_feed_addr) {
						if ( adv_feed_addr[key] == avr_addrs[i] ) {
							adv_feed_val[key] = parseInt(avr_datas[i], 10);
							// console.log(adv_feed_addr[key]+':'+adv_feed_val[key]);
						} 
					}
				}		
			}	// defect value 1,2,3
			else if ( avr_addrs[i] >= '0x461' && avr_addrs[i] <= '0x463') {
				switch(avr_addrs[i]) {
					case '0x461':	device_val_1.Defect = parseInt(avr_datas[i], 10);
									break;
					case '0x462':	device_val_2.Defect = parseInt(avr_datas[i], 10);
									break;
					case '0x463':	device_val_3.Defect = parseInt(avr_datas[i], 10);
									break;
					default: break;						
				}
				//console.log(avr_addrs[i] +':'+avr_datas[i]);
			} // pxl size value 1,2,3
			else if ( avr_addrs[i] >= '0x42F' && avr_addrs[i] <= '0x431') {
				switch(avr_addrs[i]) {
					case '0x42F':	device_val_1.Pxl = parseInt(avr_datas[i], 10);
									break;
					case '0x430':	device_val_2.Pxl = parseInt(avr_datas[i], 10);
									break;
					case '0x431':	device_val_3.Pxl = parseInt(avr_datas[i], 10);
									break;
					default: break;
				}
				// console.log(avr_addrs[i] +':'+avr_datas[i]);
			} // device_rgb value 1~3
			else if ( avr_addrs[i] >= '0x46D' && avr_addrs[i] <= '0x490') {
				
				if(avr_addrs[i] >= '0x46D' && avr_addrs[i] <= '0x478') {
					
					for(var key in device_addr_1) {
						if ( device_addr_1[key] == avr_addrs[i] ) {
							device_val_1[key] = parseInt(avr_datas[i], 10);
							//console.log(device_addr_1[key]+':'+device_val_1[key]);
						}	
					}
					
				} else if(avr_addrs[i] >= '0x479' && avr_addrs[i] <= '0x484') {
					for(var key in device_addr_2) {
						if ( device_addr_2[key] == avr_addrs[i] ) {
							device_val_2[key] = parseInt(avr_datas[i], 10);
							//console.log(device_addr_2[key]+':'+device_val_2[key]);
						}
					}
				} else 	{
				//else if(avr_addrs[i] >= '0x485' && avr_addrs[i] <= '0x490'){
					for(var key in device_addr_3) {
						if ( device_addr_3[key] == avr_addrs[i] ) {
							device_val_3[key] = parseInt(avr_datas[i], 10);
							//console.log(device_addr_3[key]+':'+device_val_3[key]);
						}	
					}
				}
			} 
			// device_rgb on/off value 1~3
			else if ( avr_addrs[i] >= '0x405' && avr_addrs[i] <= '0x428') {
				
				if( avr_addrs[i] >= '0x405' && avr_addrs[i] <= '0x410' ) {
					
					for(var key in device_addr_1) {
						if ( device_addr_1[key] == avr_addrs[i] ) {
							device_val_1[key] = parseInt(avr_datas[i], 10);
							//console.log(device_addr_1[key]+':'+device_val_1[key]);
						}	
					}
				
				} else if(avr_addrs[i] >= '0x411' && avr_addrs[i] <= '0x41C') {
					for(var key in device_addr_2) {
						if ( device_addr_2[key] == avr_addrs[i] ) {
							device_val_2[key] = parseInt(avr_datas[i], 10);
							//console.log(device_addr_2[key]+':'+device_val_2[key]);
						}	
					}
				} else {
					for(var key in device_addr_3) {
						if ( device_addr_3[key] == avr_addrs[i] ) {
							device_val_3[key] = parseInt(avr_datas[i], 10);
							//console.log(device_addr_3[key]+':'+device_val_3[key]);
						}	
					}
				}
			}	// eject on/off value 
			else if ( avr_addrs[i] == '0x600') {
				for(var key in Eject_Feed_onoff_addr) {
					if ( Eject_Feed_onoff_addr[key] == avr_addrs[i] ) {
						Eject_Feed_onoff_val[key] = parseInt(avr_datas[i], 10);
						// console.log(Eject_Feed_onoff_addr[key]+':'+Eject_Feed_onoff_val[key]);
					}	
				}
			} // BDS~RLC Camera adv value 
			else if ( avr_addrs[i] >= '0x500' && avr_addrs[i] <= '0x5BF' ) {
				
				if ( avr_addrs[i] >= '0x500' && avr_addrs[i] <= '0x50F' ) {
					for(var key in B_D_S_CamAddr) {
						if ( B_D_S_CamAddr[key] == avr_addrs[i] ) {
							B_D_S_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(B_D_S_CamAddr[key]+':'+B_D_S_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x510' && avr_addrs[i] <= '0x51F' ) {
					for(var key in B_D_C_CamAddr) {
						if ( B_D_C_CamAddr[key] == avr_addrs[i] ) {
							B_D_C_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(B_D_C_CamAddr[key]+':'+B_D_S_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x520' && avr_addrs[i] <= '0x52F' ) {
					for(var key in B_L_S_CamAddr) {
						if ( B_L_S_CamAddr[key] == avr_addrs[i] ) {
							B_L_S_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(B_L_S_CamAddr[key]+':'+B_L_S_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x530' && avr_addrs[i] <= '0x53F' ) {
					for(var key in B_L_C_CamAddr) {
						if ( B_L_C_CamAddr[key] == avr_addrs[i] ) {
							B_L_C_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(B_L_C_CamAddr[key]+':'+B_L_C_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x540' && avr_addrs[i] <= '0x54F' ) {
					for(var key in G_D_S_CamAddr) {
						if ( G_D_S_CamAddr[key] == avr_addrs[i] ) {
							G_D_S_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(G_D_S_CamAddr[key]+':'+G_D_S_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x550' && avr_addrs[i] <= '0x55F' ) {
					for(var key in G_D_C_CamAddr) {
						if ( G_D_C_CamAddr[key] == avr_addrs[i] ) {
							G_D_C_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(G_D_C_CamAddr[key]+':'+G_D_C_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x560' && avr_addrs[i] <= '0x56F' ) {
					for(var key in G_L_S_CamAddr) {
						if ( G_L_S_CamAddr[key] == avr_addrs[i] ) {
							G_L_S_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(G_L_S_CamAddr[key]+':'+G_L_S_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x570' && avr_addrs[i] <= '0x57F' ) {
					for(var key in G_L_C_CamAddr) {
						if ( G_L_C_CamAddr[key] == avr_addrs[i] ) {
							G_L_C_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(G_L_C_CamAddr[key]+':'+G_L_C_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x580' && avr_addrs[i] <= '0x58F' ) {
					for(var key in R_D_S_CamAddr) {
						if ( R_D_S_CamAddr[key] == avr_addrs[i] ) {
							R_D_S_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(R_D_S_CamAddr[key]+':'+R_D_S_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x590' && avr_addrs[i] <= '0x59F' ) {
					for(var key in R_D_C_CamAddr) {
						if ( R_D_C_CamAddr[key] == avr_addrs[i] ) {
							R_D_C_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(R_D_C_CamAddr[key]+':'+R_D_C_CamVal[key]);
						}	
					}
				} else if ( avr_addrs[i] >= '0x5A0' && avr_addrs[i] <= '0x5AF' ) {
					for(var key in R_L_S_CamAddr) {
						if ( R_L_S_CamAddr[key] == avr_addrs[i] ) {
							R_L_S_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(R_L_S_CamAddr[key]+':'+R_L_S_CamVal[key]);
						}	
					}
				} else {
					for( var key in R_L_C_CamAddr ) {
						if ( R_L_C_CamAddr[key] == avr_addrs[i] ) {
							R_L_C_CamVal[key] = parseInt(avr_datas[i], 10);
							// console.log(R_L_C_CamAddr[key]+':'+R_L_C_CamVal[key]);
						}
					}
				}
			}	// ejecting value : delay
			else if ( avr_addrs[i] >= '0x467' && avr_addrs[i] <= '0x469' ) {
				for( var key in ejecting_addr ) {
					if ( ejecting_addr[key] == avr_addrs[i] ) {
						ejecting_val[key] = parseInt(avr_datas[i], 10);
						// console.log(ejecting_addr[key]+':'+ejecting_val[key]);
					}
				}
			}	// ejecting value : head, hold
			else if ( avr_addrs[i] >= '0x601' && avr_addrs[i] <= '0x606' ) {
				for( var key in ejecting_addr ) {
					if ( ejecting_addr[key] == avr_addrs[i] ) {
						ejecting_val[key] = parseInt(avr_datas[i], 10);
						// console.log(ejecting_addr[key]+':'+ejecting_val[key]);
					}
				}
			}
			else if ( avr_addrs[i] >= '0x101' && avr_addrs[i] <= '0x103' ) {
				for( var key in cleaning_addr ) {
					if ( cleaning_addr[key] == avr_addrs[i] ) {
						cleaning_val[key] = parseInt(avr_datas[i], 10);
						//console.log(cleaning_addr[key]+':'+cleaning_val[key]);
					}
				}
			}
			else if ( avr_addrs[i] >= '0x300' && avr_addrs[i] <= '0x30E' ) {
				for( var key in lighting_addr ) {
					if ( lighting_addr[key] == avr_addrs[i] ) {
						lighting_val[key] = parseInt(avr_datas[i], 10);
						//console.log(lighting_addr[key]+':'+lighting_val[key]);
					}
				}
			}
			else if ( avr_addrs[i] >= '0x402' && avr_addrs[i] <= '0x403' ) {
				for( var key in camera_onoff_addr ) {
					if ( camera_onoff_addr[key] == avr_addrs[i] ) {
						camera_onoff_val[key] = parseInt(avr_datas[i], 10);
						//console.log(camera_onoff_addr[key]+':'+camera_onoff_val[key]);
					}
				}
			}  else if( avr_addrs[i] >= '0x10B' && avr_addrs[i] <= '0x10C' ) {
				// console.log('back_front_addr : '+ avr_addrs[i] +':'+avr_datas[i]);
				for( var key in back_front_addr ) {
					if ( back_front_addr[key] == avr_addrs[i] ) {
						back_front_val[key] = parseInt(avr_datas[i], 10);
						//console.log(back_front_addr[key]+':'+back_front_val[key]);
					}
				}
			} else if( avr_addrs[i] >= '0x109' && avr_addrs[i] <= '0x10A' ) {
				// console.log('back_rear_addr : '+ avr_addrs[i] +':'+avr_datas[i]);
				for( var key in back_rear_addr ) {
					if ( back_rear_addr[key] == avr_addrs[i] ) {
						back_rear_val[key] =  parseInt(avr_datas[i], 10);
						//console.log(back_rear_addr[key]+':'+back_rear_val[key]);
					}
				}
			}
			
		}
		
		
		if( program_init_flag == 0) {
				
			// mode name code modify
			/*
			console.log( 'mode_1 : ' + mode_name_val.mode_1);
			console.log( 'mode_2 : ' + mode_name_val.mode_2);
			console.log( 'mode_3 : ' + mode_name_val.mode_3);
			console.log( 'mode_4 : ' + mode_name_val.mode_4);
			console.log( 'mode_5 : ' + mode_name_val.mode_5);
			console.log( 'mode_6 : ' + mode_name_val.mode_6);
			console.log( 'mode_7 : ' + mode_name_val.mode_7);
			console.log( 'mode_8 : ' + mode_name_val.mode_8);
			*/
			
			( function( mode_name_obj ) {
				var mode_idx=0;
				var mode_name_protocol='';
				
				for( var key in mode_name_obj ) {
					var num;
					var str='';
					mode_name_obj[key] = mode_name_obj[key].split(',');
					for( var i=0; i< 20; i++ ) {
						num = parseInt(mode_name_obj[key][i], 10);
						if( num == 0 ) {
							str += String.fromCharCode(num);
							break;
						}	
						str += String.fromCharCode(num);
						
					}
					// console.log('res string : '+ str);
					mode_names[key] = str;
					$("#mode_"+(mode_idx+1)).html(mode_names[key]);
					mode_idx++;
				}
				
				for(var key in mode_names) {
					mode_name_protocol += (mode_names[key] + ':');
				}
				mode_name_protocol = mode_name_protocol.slice(0, -1);
				console.log( 'mode_name_protocol : ' + mode_name_protocol.toString()); 
				socket.emit('mode_name_save', mode_name_protocol);
				
			})( mode_name_val );
			
			program_init_flag = 1;
		}
		
		// account_menu_init : Operator, modify: 0126
		if( current_account == accounts.operator ) {
			
			document.getElementById("help").disabled=true;
			$( "#menu_3" ).menu( "option", "disabled", true );	// menu disable			
						
			if ( validate_flag != true ) {
				pass_match_process = pass_match_processes.validate_unlock;
				if( $("#date").val().slice(6,10) != '1970' ) {
					$("#pass_input_dlg").dialog({ title: 'Program Password'});
					$('#pass_input_lab').html('Validate Password : ');
					$(pass_input_dlg).dialog("open");	
				} 
				disableElements();
			}
			
		} else {
			document.getElementById("help").disabled=false;
			$( "#menu_3" ).menu( "option", "disabled", false );	// menu disable
		}
		
		/*	
		// account_menu_init : Admin, modify: 0126
		account_id.current = 'admin';
		$("#account_menu_title").html( $("#admin").html() );
		enableElements();
		*/
		
		$('#step-1st-img').show();
		$('#step-2nd-img').hide();
		$('#step-3rd-img').hide();
		
		// Mode Value INIT
		mode_val.past_val = mode_val.mode;
		$("#mode_menu_title").html( $("#mode_"+(mode_val.mode+1)).html() );	
		
		// console.log( ' mode_names["mode_"+(mode_val.mode+1):'+ mode_names["mode_"+(mode_val.mode+1)]);
		
		
		// video address, value
		video_addr = video_addr_A;
		video_val = video_val_A;
		var el_form = document.getElementById("form");
		
		// eject, feed init
		if( Eject_Feed_onoff_val.EjectOnOff == 0 ) {
			
			$("#eject").html("EJECT OFF").css("background", "#6DCBB0");
			
			// form value init start
			el_form.disabled= false;	// vd form enable
			video_val.form = 0;
			$("#form").html('Corr.');
			$("#form").val(0);
			
		} else {
			el_form.disabled= true;	// vd form disable
			$("#eject").html("EJECT ON").css("background", "#D5FFE8");
		}
		
		if( Eject_Feed_onoff_val.FeedOnOff == 0 ) {
			$("#feed").html("FEED OFF").css("background", "#6DCBB0");
		} else {
			$("#feed").html("FEED ON").css("background", "#D5FFE8");
		}
		
		// Model value read
		var nir_arr = [], stage_arr = [], channel_arr = [];
		nir_arr = make_binary(model_val['nir']);
		stage_arr = make_binary(model_val['stage']);
		channel_arr = make_binary(model_val['channel']);
		
		// channel, stage, nir value init
		model_val.channel = channel_arr[0]*1+channel_arr[1]*2+channel_arr[2]*4;
		model_val.stage = stage_arr[3]*8;
		model_val.nir = nir_arr[4]*16;
		
		$('#chute_list').html('');
		// chute_list init
		for( var i=0; i<=model_val.channel; i++ ) {
			$('#chute_list').append('<option value='+(i+1)+'>'+(i+1)+'</option>');
		}
		$('#chute_list').selectmenu('refresh', true);
		
		// nir func init
		if( model_val.nir == 16 ) {
			$("#md-nir").html('INSTALLED');
			$("#md-nir").val(16);
		} else {
			$("#md-nir").html('NONE');
			$("#md-nir").val(0);
		}
		
		// stage init
		if( model_val.stage == 8 ) {
			$("#md-stage").html('SINGLE');
			$("#md-stage").val(8);
		} else {
			$("#md-stage").html('DOUBLE');
			$("#md-stage").val(0);
		}
		
		// channel init
		for(var i=0; i<6; i++) {
			if( i!=model_val.channel ) {
				$("#channel-"+i).css('background', '#6DCBB0');
			} else	$("#channel-"+i).css('background', '#D5FFE8');
		}
		
		var rgb_a_bin = make_binary(model_val.rgb_a);
		var rgb_b_bin = make_binary(model_val.rgb_b);	
		
		for(var i=0; i<6; i++) {
			$('#rgb-a-'+i).val(rgb_a_bin[i]);
			$('#rgb-b-'+i).val(rgb_b_bin[i]);
			
			if( $('#rgb-a-'+i).val() == 0 ) {
				$('#rgb-a-'+i).css('background', '#6DCBB0');
			} else {
				$('#rgb-a-'+i).css('background', '#D5FFE8');
			}
			
			if( $('#rgb-b-'+i).val() == 0 ) {
				$('#rgb-b-'+i).css('background', '#6DCBB0');
			} else {
				$('#rgb-b-'+i).css('background', '#D5FFE8');
			}
			
		}
		
		
		// model : feed info check
		var feed_info_1_val = adv_feed_val.Feed_allocation_information_1, 
			feed_info_2_val = adv_feed_val.Feed_allocation_information_2;
		
		var feed_info_1_binary=new Array(8), feed_info_2_binary=new Array(8);
				
		// binary check
		for(var i=7, j=0; i>=0; i--) {
			
			feed_info_1_binary[i] = parseInt(feed_info_1_val%2);	// feed info 1~4
			feed_info_2_binary[i]= parseInt(feed_info_2_val%2);		// feed info 5~8
			
			// \B3\AA\B4\AB \B8\F2\C0\BB \C0\FA\C0\E5
			feed_info_1_val = parseInt(feed_info_1_val/2);		
			feed_info_2_val = parseInt(feed_info_2_val/2);
									
			if( parseInt(i%2) == 0 ) {	// 2 step 
				
				// feed_allocation_info.feed_toggle 1~8 store
				feed_allocation_info_1['feed_toggle_'+(j+1)] = parseInt(feed_info_1_binary[i+1]*1) + parseInt(feed_info_1_binary[i]*2);
				feed_allocation_info_2['feed_toggle_'+(j+5)] = parseInt(feed_info_2_binary[i+1]*1) + parseInt(feed_info_2_binary[i]*2);
								
				j++; 
			}
		}
		
		// feed_allocation_info_1
		for(var key in feed_allocation_info_1) {
			if ( feed_allocation_info_1[key] == 0 ) $('#'+key).val('1ST');
			else if ( feed_allocation_info_1[key] == 1 ) $('#'+key).val('2ND');
			else $('#'+key).val('3RD');
		}
		
		// feed_allocation_info_2
		for(var key in feed_allocation_info_2) {
			if ( feed_allocation_info_2[key] == 0 ) $('#'+key).val('1ST');
			else if ( feed_allocation_info_2[key] == 1 ) $('#'+key).val('2ND');
			else $('#'+key).val('3RD');
		}
		
		// init airgun object init
		rgb_addr = rgb_addr_A;
		rgb_val = rgb_val_A;
		airgun_addr = airgun_addr_A;
		airgun_val = airgun_val_A;			
		
		// html display init
		$("#start_stop").html('STOP').css('background', '#6DCBB0');		// stop
		$("#manual_auto").html("MANUAL").css('background', '#6DCBB0');	// manual
		
		// Device addr, value, text(title) Initialization
		$('.step-btn').css("background", "#04B486");
		$('#step-1st').css("background", "#D5FFE8").css("color", step_color[0]);
		$('#step-2nd').css("color", step_color[1]);
		$('#step-3rd').css("color", step_color[2]);
		$('#Feed_val').css("color", step_color[0]);
		$('.defect_vals').css("color", step_color[0]);
		$('.RGB_val').css("color", step_color[0]);
		
		device_addr = device_addr_1; 
		device_val  = device_val_1; 
		device_TEXT = device_TEXT_1;	
		
		// spot, color value init (display value)
		device_val_1.Defect +=1;
		device_val_1.Pxl +=1;
		device_val_2.Defect +=1;
		device_val_2.Pxl +=1;
		device_val_3.Defect +=1;
		device_val_3.Pxl +=1;
		
		// Cleaning init
		for(var key in cleaning_addr) {
			value = cleaning_val[key].toString();
			$(ID_cleaning_val[key]).val(value);	// value display, ID_device_addr_1 object = HTML ID
		}
		
		// auto enable, Disable	Init
		if( cleaning_val.Auto == 1 ) { 
			$("#clean-auto-btn").css("background", "#D5FFE8");
			$('#clean-auto-btn').html('ENABLE');
		}		
		else {
			$("#clean-auto-btn").css("background", "#04B486");
			$('#clean-auto-btn').html('DISABLE');
		}		
		
		// cleaning_val.Manual Init
		if( cleaning_val.Manual == 1 ) {	// Manual on
			$('#clean-title-manual').css("background", "#D5FFE8");
			$('#clean-title-manual').html('ON');
		}else {		// Manual off 
			$('#clean-title-manual').css("background", "#04B486");
			$('#clean-title-manual').html('OFF');
		}
		// //console.log('cleaning_val done');
		
		// device_addr_1: default 1st
		for(var key in device_addr_1) {
			//address = device_addr_1[key] ;
			
			// RGB_ONOFF key Break		
			if( ( parseInt(device_addr_1[key], 16) >= 0x405 )&&( parseInt(device_addr_1[key], 16) <= 0x410 )  ) {
				if ( device_val[key] == 1 ) {	// on
					$("#"+key.slice(0,5)).css("border", "2px solid #D5FFE8");
					// console.log("border on "+key.slice(0,5));
				} else {	// off
					$("#"+key.slice(0,5)).css("border", "2px solid #6BBA96");
					// console.log("border off "+key.slice(0,5));
				}
			}
			//value = device_val_1[key].toString();
			value = parseInt(device_val_1[key]);
			
			$(ID_device_addr_1[key]).val(value);	// value display, ID_device_addr_1 object = HTML ID
		}
		
		//console.log('device_1 init done');

		// adv_feed_addr 
		for(var key in adv_feed_addr) {
			
			// feeding mode init
			if ( (parseInt(adv_feed_addr[key], 16) == 0x200) ) {
				if( adv_feed_val[key] == '0' ) {	
					$( "#Adv_feed_manual_auto" ).css("background", "#6DCBBD");
					$( "#Adv_feed_manual_auto" ).find('label').html("MANUAL");
				}else {
					$( "#Adv_feed_manual_auto" ).css("background", "#D5FFE8");
					$( "#Adv_feed_manual_auto" ).find('label').html("AUTO");					
				}
			}
			
			// feeding individual enable-disable init
			if( (parseInt(adv_feed_addr[key], 16) >= 0x202) && (parseInt(adv_feed_addr[key], 16) <= 0x209) ) {
				
				if( adv_feed_val[key] == '1' ) {	// enable
					$( "#"+key ).css("background", "#D5FFE8");
					$( "#"+key ).val("ENABLE");
				}else {								// disable
					$( "#"+key ).css("background", "#6DCBB0");
					$( "#"+key ).val("DISABLE");					

				}
			}
			
			// feed individual value init
			if( (parseInt(adv_feed_addr[key], 16) >= 0x20D) && (parseInt(adv_feed_addr[key], 16) <= 0x214) ) {
				value = adv_feed_val[key].toString();
				$(ID_adv_feed_addr[key]).val(value);	// value display, ID_adv_feed_addr object = HTML ID
			}
		}
						
		//console.log('adv_feed_val init done');
		
		for(var key in ejecting_val) {
			$(ID_Ejecting_val[key]).val(ejecting_val[key]);		// value display
			// //console.log(key + ' : ' + ejecting_val[key]);
		}
		//console.log('ejecting_val init done');
		
		for(var key in B_D_S_CamAddr) {
			B_D_S_CamVal[key] = (B_D_S_CamVal[key]-100)*0.2;
			// //console.log('B_D_S_CamVal[key]: ' + B_D_S_CamVal[key]);
		}
		for(var key in B_D_C_CamAddr) {
			B_D_C_CamVal[key] = (B_D_C_CamVal[key]-100)*0.2;
			// //console.log('B_D_C_CamVal[key]: ' + B_D_C_CamVal[key]);
		}
		for(var key in B_L_S_CamAddr) {
			B_L_S_CamVal[key] = (B_L_S_CamVal[key]-100)*0.2;
			// //console.log('B_L_S_CamVal[key]: ' + B_L_S_CamVal[key]);
		}
		for(var key in B_L_C_CamAddr) {
			B_L_C_CamVal[key] = (B_L_C_CamVal[key]-100)*0.2;
			// //console.log('B_L_C_CamVal[key]: ' + B_L_C_CamVal[key]);
		}
		
		for(var key in G_D_S_CamAddr) {
			G_D_S_CamVal[key] = (G_D_S_CamVal[key]-100)*0.2;
			// //console.log('G_D_S_CamVal[key]: ' + G_D_S_CamVal[key]);
		}
		for(var key in G_D_C_CamAddr) {
			G_D_C_CamVal[key] = (G_D_C_CamVal[key]-100)*0.2;
			// //console.log('G_D_C_CamVal[key]: ' + G_D_C_CamVal[key]);
		}
		for(var key in G_L_S_CamAddr) {
			G_L_S_CamVal[key] = (G_L_S_CamVal[key]-100)*0.2;
			// //console.log('G_L_S_CamVal[key]: ' + G_L_S_CamVal[key]);
		}
		for(var key in G_L_C_CamAddr) {
			G_L_C_CamVal[key] = (G_L_C_CamVal[key]-100)*0.2;
			// //console.log('G_L_C_CamVal[key]: ' + G_L_C_CamVal[key]);
		}
		
		for(var key in R_D_S_CamAddr) {
			R_D_S_CamVal[key] = (R_D_S_CamVal[key]-100)*0.2;
			// //console.log('R_D_S_CamVal[key]: ' + R_D_S_CamVal[key]);
		}
		for(var key in R_D_C_CamAddr) {
			R_D_C_CamVal[key] = (R_D_C_CamVal[key]-100)*0.2;
			// //console.log('R_D_C_CamVal[key]: ' + R_D_C_CamVal[key]);
		}
		for(var key in R_L_S_CamAddr) {
			R_L_S_CamVal[key] = (R_L_S_CamVal[key]-100)*0.2;
			// //console.log('R_L_S_CamVal[key]: ' + R_L_S_CamVal[key]);
		}
		for(var key in R_L_C_CamAddr) {
			R_L_C_CamVal[key] = (R_L_C_CamVal[key]-100)*0.2;
			// //console.log('R_L_C_CamVal[key]: ' + R_L_C_CamVal[key]);
		}
		
		// 0x300~0x305: Light On Off Button, 0x309~0x30E: Light values
		for(var key in lighting_addr) {
			if( lighting_addr[key] >= '0x300' && lighting_addr[key] <= '0x305' ) {
				if( lighting_val[key] == 255 ) {
					$(ID_lighting_val[key]).html('ON').css('background', '#D5FFE8');
				} else {
					$(ID_lighting_val[key]).html('OFF').css('background', '#6DCBB0');
				}
			} else {
				$(ID_lighting_val[key]).val(lighting_val[key]);
			}
		}
		
		// Camera on off value init
		for(var key in camera_onoff_addr) {
			// //console.log(camera_onoff_val[key]);
			var ret_binary = new Array();
			ret_binary = make_binary(camera_onoff_val[key]);			
			
			switch(key) {
				case 'rgb_A':	// //console.log('rgb_A ret_binary :'+ ret_binary);
								for(var i=0; i<8; i++) {
									$('#camera_a'+(i+1)).val(ret_binary[i]);	// val store
									if(ret_binary[i] == 1) {
										$('#camera_a'+(i+1)).css('background', '#D5FFE8');
										$('#camera_a'+(i+1)).html('ON');
									} else { 
										$('#camera_a'+(i+1)).css('background', '#6DCBB0');
										$('#camera_a'+(i+1)).html('OFF');
									}	
								}
								break;
				case 'rgb_B':	// //console.log('rgb_B ret_binary :'+ ret_binary);
								for(var i=0; i<8; i++) {
									$('#camera_b'+(i+1)).val(ret_binary[i]);	// val store
									if(ret_binary[i] == 1) {
										$('#camera_b'+(i+1)).css('background', '#D5FFE8');
										$('#camera_b'+(i+1)).html('ON');
									} else {
										$('#camera_b'+(i+1)).css('background', '#6DCBB0');
										$('#camera_b'+(i+1)).html('OFF');
									}
								}
								break;
			}
			ret_binary.length = 0;
			delete ret_binary;
			
		}
		
		mode_ena_disable_check();
		
		// component_list init start
		$('#component_list').html('');
		for( var i=0; i<=model_val.channel; i++ ) {
			$('#component_list').append('<option value='+(i+1)+'>'+(i+1)+'</option>');
		}
		$('#component_list').selectmenu('refresh', true);
		// component_list end
				
		//back_front_value init start
		switch(back_front_val.bg_f_h){
			case 0: back_front_val.html_val = 0 + back_front_val.bg_f_l;
					break;
			case 1: back_front_val.html_val = 256 + back_front_val.bg_f_l;
					break;
			case 2:	back_front_val.html_val = 512 + back_front_val.bg_f_l;
					break;		
			case 3: back_front_val.html_val = 768 + back_front_val.bg_f_l;
					break;		
		}
		//console.log('back_front_val.html_val: '+back_front_val.html_val);
		$("#bg_f_display_val").val(back_front_val.html_val);
		$("#bg_f_val").val(back_front_val.html_val);
		$( "#bgf_slider" ).slider( "option", "value", back_front_val.html_val );
		// back_front_value init end
		  
		// back_rear_val init start
		switch(back_rear_val.bg_r_h){
			
			case 0: back_rear_val.html_val = 0 + back_rear_val.bg_r_l;
					break;
			case 1: back_rear_val.html_val = 256 + back_rear_val.bg_r_l;
					break;
			case 2:	back_rear_val.html_val = 512 + back_rear_val.bg_r_l;
					break;		
			case 3: back_rear_val.html_val = 768 + back_rear_val.bg_r_l;
					break;		
		
		}
		//console.log('back_rear_val.html_val: '+back_rear_val.html_val);
		$("#bg_r_display_val").val(back_rear_val.html_val);
		$("#bg_r_val").val(back_rear_val.html_val);
		$( "#bgr_slider" ).slider( "option", "value", back_rear_val.html_val );
		// back_rear_val init end 
		
		console.log('avr value init ok');
		
	}	// func end
	
	function AckNack_Check_Func() {
				
		//console.log('AckNack_Check_Func');
		clearInterval(timer);
		//$(device_addr_AckNack).val('');
		//$(device_addr_AckNack).css("background", "#93c3cd");
			
	}
					
	// Data from server
	socket.on('read_server_mem_response', function(data) {
		/*
		//console.log('read_server_mem_response event!!');
		//console.log( data.DV_OBJ + ' ' + data.DV_ADDR + ' ' + data.VAL + ' ' + data.ID + ' ' + data.KEY);
		*/
		device_object_val = device_objects[data.DV_OBJ];	// device object store
		device_object_val[data.KEY] = data.VAL;	// Object value store 
		
		////console.log(device_object_val[data.KEY] + ' ' + data.KEY);
		
		if( data.DV_ADDR == model_addr.rgb_b ) {
			init_html_fix_value();	// Web Value Display
			//console.log('fix_value_function end');
		}
		
		// Eject_Feed_onoff_addr.FeedOnOff: Last of the requested address.
		if( data.DV_ADDR == ejecting_addr.hold_val_3 ) {
			init_html_value();	// Web Value Display
		}
		
	});
		
	/* make Binary */
	// Low address: Low data
	function make_binary(value) {
		var binary = new Array();
						
		for(var i=0; i<8; i++) {
			binary[i] = parseInt(value%2);
			value = parseInt(value/2);
		}
		
		return binary;
	}
			
	$("#target_mode").click( function() {
		socket.emit('onboard_on');
		$("#target_mode").focus();
	});
	
	$(".mode_bts").click( function() {
		
		console.log('this.id :'+this.id);
		mode_btns_id = this.id;
		
		$( alert_dlg ).dialog( "open" );		// dialog close
		
	});
	
	
	$(".account_list_sub").click( function() {
		
		$(pass_input_dlg).dialog("close");
		
		pass_match_process = pass_match_processes.account;
		account_id.select = this.id;
		
		switch(this.id) {
			
			case 'admin':	current_account = accounts.admin;
							if( account_id.past_id != 'admin' ) {
								$(pass_input_dlg).dialog("open");	
							}
							account_id.select = 'admin';
							break;
			
			case 'engineer':	current_account = accounts.engineer;
								console.log('current_account = accounts.engineer');
								if( account_id.past_id != 'admin' && account_id.past_id != 'engineer') {
									$(pass_input_dlg).dialog("open");
								} else {
									
									$("#account_menu_title").html( $("#engineer").html());
									$( "#menu_3" ).menu( "option", "disabled", false );	// menu enable
									document.getElementById("help").disabled=false;		// help btn enable
 									account_id.past_id = account_id.current = account_id.select = 'engineer';
									
								}
								break;
			
			case 'operator':	current_account = accounts.operator;
								$("#account_menu_title").html( $("#operator").html());
								
								validate_check_program();
								
								if ( validate_flag != true ) {
									pass_match_process = pass_match_processes.validate_unlock;
									
									if( $("#date").val().slice(6,10) != '1970' ) {
										$("#pass_input_dlg").dialog({ title: 'Program Password'});
										$('#pass_input_lab').html('Validate Password : ');
										$(pass_input_dlg).dialog("open");	
									}
									disableElements();
								} else {
									enableElements();
									$( "#menu_3" ).menu( "option", "disabled", true );	// menu disable
									document.getElementById("help").disabled=true;	
																		
								}
								
								account_id.current = account_id.past_id = account_id.select = 'operator';
								break;
			
			default: break;
		}
			
	});
		
	$(".mode_list_sub").click( function() {
		select_mode_id = this.id;
		alert_flag_parent = alert_flag.mode_change;
		console.log( select_mode_id+' : '+ mode_val.mode)
		if( $('#'+select_mode_id).val() != mode_val.mode ) {
			$( alert_dlg ).dialog( "open" );		// dialog close
		}
	});
		
	/* Model click event start */
	$(".channel_btn").click(function() {
		
		//console.log('channel id : '+ this.value);
		model_val.channel = parseInt(this.value);
		
		var chute_size = $('#chute_list option').size();
		
		// all option remove
		for(var i=0; i<chute_size; i++) {
			$('#chute_list option:last').remove();
		}
		
		// channel append
		for( var i=0; i<=model_val.channel; i++ ) {
			$('#chute_list').append('<option value='+(i+1)+'>'+(i+1)+'</option>');
		}
		$('#chute_list').selectmenu('refresh', true);
		
		
		for(var i=0; i<6; i++) {
			if( i!=model_val.channel ) {
				$("#channel-"+i).css('background', '#6DCBB0');
			} else	$("#channel-"+i).css('background', '#D5FFE8');
		}
		
		// tx data
		address = model_addr.channel;			// address store
		Command = '4';
		value =  (model_val.nir+model_val.stage+model_val.channel).toString();  // must be "toString()"
		socket_emit(ID, Command, address, value);
	});
		
	$("#md-nir").click(function() {
		//console.log('nir');
		if( this.value == 0 ){
			$("#md-nir").html('INSTALLED');
			this.value = 16;
			model_val.nir = 16;
		} else {
			this.value = 0;
			model_val.nir = 0;
			$("#md-nir").html('NONE');
		}
		// tx data
		address = model_addr.channel;			// address store
		Command = '4';
		value =  (model_val.nir+model_val.stage+model_val.channel).toString();  // must be "toString()"
		socket_emit(ID, Command, address, value);
	});
	
	$("#md-stage").click(function() {

		//console.log('stage');
		if( this.value == 0 ){
			$("#md-stage").html('SINGLE');
			this.value = 8;
			model_val.stage = 8;
		} else {
			this.value = 0;
			model_val.stage = 0;
			$("#md-stage").html('DOUBLE');
		}
		
		// tx data
		address = model_addr.channel;			// address store
		Command = '4';
		value =  (model_val.nir+model_val.stage+model_val.channel).toString();  // must be "toString()"
		socket_emit(ID, Command, address, value);
	});
	
	$(".check-rgb-a").click(function() {
		//console.log(this.id);
		var select_id = parseInt(this.id.charAt(6));
		var arr_rgb_a = make_binary(model_val.rgb_a);
		
		if ( this.value == 0 ) {
			this.value = 1;
			arr_rgb_a[select_id] = this.value;
			$('#'+this.id).css('background', '#D5FFE8');
		} else {
			this.value = 0;
			arr_rgb_a[select_id] = this.value;
			$('#'+this.id).css('background', '#6DCBB0');
		}
		
		address = model_addr.rgb_a;			// address store
		Command = '4';
		model_val.rgb_a = 	arr_rgb_a[0]*1 + arr_rgb_a[1]*2 + 
							arr_rgb_a[2]*4 + arr_rgb_a[3]*8 + 
							arr_rgb_a[4]*16 + arr_rgb_a[5]*32;
		value = model_val.rgb_a;				
		socket_emit(ID, Command, address, value.toString());		
	});
	
	$(".check-rgb-b").click(function() {
		//console.log(this.id);
		var select_id = parseInt(this.id.charAt(6));
		var arr_rgb_b = make_binary(model_val.rgb_b);
		
		if ( this.value == 0 ) {
			this.value = 1;
			arr_rgb_b[select_id] = this.value;
			$('#'+this.id).css('background', '#D5FFE8');
		} else {
			this.value = 0;
			arr_rgb_b[select_id] = this.value;
			$('#'+this.id).css('background', '#6DCBB0');
		}
		
		address = model_addr.rgb_b;			// address store
		Command = '4';
		model_val.rgb_b = 	arr_rgb_b[0]*1 + arr_rgb_b[1]*2 + 
							arr_rgb_b[2]*4 + arr_rgb_b[3]*8 + 
							arr_rgb_b[4]*16 + arr_rgb_b[5]*32;
		value = model_val.rgb_b;			
		socket_emit(ID, Command, address, value.toString());	
	});
	/* Model click event end */
	
	// Airgun Dialog Event start
	$(".airgun_check input[type=checkbox]").click(function() {				
		//console.log('airgun check event value : '+ this.id);
				
		checkbox_false();	// all checkbox false init
		
		// -1 is transmit data
		airgun_val[rgb_val.html_chute] = parseInt(this.id.slice(8));
							
		// checkbox checked
		$("#check input[id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);
		
		if( airgun_val[rgb_val.html_chute] != airgun_val['past_'+rgb_val.html_chute]) {
			$("#check input[id=checkbox"+airgun_val['past_'+rgb_val.html_chute]+"]").prop("checked", false);
		} else {
			$("#check input[id=checkbox"+airgun_val['past_'+rgb_val.html_chute]+"]").prop("checked", true);
		}
		
		// marking check
		for(var i=0; i<marking_ch_num[rgb_val.html_chute].length; i++) {
			$("#check input[id=checkbox"+marking_ch_num[rgb_val.html_chute][i]+"]").prop("checked", true);
		}
		
		$("#check").buttonset("refresh");
							
		$("#channel_val").val(airgun_val[rgb_val.html_chute]);	
		airgun_val['past_'+rgb_val.html_chute] = airgun_val[rgb_val.html_chute];
		
		// start check: 1 is start
		if( $("#start_stop").val() == 1 ) {
			Command = '4';
			address = airgun_addr.channel;	// RGB_A or RGB_B
			value = (airgun_val[rgb_val.html_chute]-1).toString();	// must be toString()
			socket_emit(ID, Command, address, value);
		}
		
	});
	
	// part button toggle
	$("#part").click(function() {
		 
		Command = '4';
		// past address, value init
		address = rgb_addr.part;	// RGB_A or RGB_B
		value = '0';	// must be toString()
		socket_emit(ID, Command, address, value);
		
		// Address Change 
		if( rgb_val.part == 'A' ) { // rgb_val.part = B
			 
			rgb_addr = rgb_addr_B;
			rgb_val = rgb_val_B;
			
			airgun_addr = airgun_addr_B;
			airgun_val = airgun_val_B;
			
		} else {	// rgb_val.part = A
			
			rgb_addr = rgb_addr_A;
			rgb_val = rgb_val_A;
			
			airgun_addr = airgun_addr_A;
			airgun_val = airgun_val_A;
			
		}
		
		//console.log('part : ' +rgb_val.part);
		$("#part").html(rgb_val.part);
		$("#chute_val").val(rgb_val.html_chute);
		
		if( $("#start_stop").val() == 1 ) {
			rgb_val.chute = 1;
								
			// 2^0 ~ 2^7
			for(var i=0; i<(rgb_val.html_chute-1); i++){
				rgb_val.chute*=2;
			}
			
			Command = '4';				
			address = rgb_addr.part;	// RGB_A or RGB_B
			value = rgb_val.chute.toString();	// must be toString()
			socket_emit(ID, Command, address, value);
		}
	});				
		
	// chute list selct event
	$( "#chute_list" ).selectmenu({
		select: function( event, ui ) {},
		width: 180,
		position: { my : "left top", at: "left bottom"}
	});
		
	$( "#chute_list" ).on( "selectmenuselect", function( event, ui ) {
		
		if( $("#manual_auto").val() != 1 ) {
			//console.log('Event selectmenuselect');
			rgb_val.html_chute=this.value;
					
			checkbox_false();
			
			// checkbox value refresh
			$("#check [id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);	
			error_marking();
			
			$('#check').buttonset("refresh");
			
			// channel value refresh
			$("#channel_val").val(airgun_val[rgb_val.html_chute]);
			airgun_val.channel = (airgun_val[rgb_val.html_chute]-1);	// data: 0~63
			
			rgb_val.chute = 1;
								
			// 2^0 ~ 2^7
			for(var i=0; i<(this.value-1); i++) {
				rgb_val.chute*=2;
			}					
			//console.log('rgb_val.chute value: ' + rgb_val.chute);
							
			if ( $("#start_stop").val() == 1 ) {
				
				Command = '4';
				// part, chute data
				address = rgb_addr.part;	// RGB_A or RGB_B
				value = rgb_val.chute.toString();	// must be toString()
				socket_emit(ID, Command, address, value);
				
				Command = '4';
				// airgun channel data
				address = airgun_addr.channel;	// RGB_A or RGB_B
				value = (airgun_val[rgb_val.html_chute]-1).toString();	// must be toString()
				socket_emit(ID, Command, address, value);
			}
			
		}
		
	});

	$(".channel_button").mouseleave(function(){
		clearInterval(timer);
	});
	
	$(".channel_button").mouseup(function(){
		clearInterval(timer);
	});
					
	// channel value up and down
	// airgun_addr.channel, airgun_val.channel
	$(".channel_button").mousedown(function(){
		var click_id = this.id;
		timer = setInterval(function() {
			
			switch(click_id){
				case 'channel_down':	
							airgun_val[rgb_val.html_chute] = parseInt(airgun_val[rgb_val.html_chute])-1;	
							if(airgun_val[rgb_val.html_chute]<=1) {
								clearInterval(timer);
								airgun_val[rgb_val.html_chute] = 1;
							}	
							$("#channel_val").val(airgun_val[rgb_val.html_chute]);
							break;
				case 'channel_up':
							airgun_val[rgb_val.html_chute] = parseInt(airgun_val[rgb_val.html_chute])+1;	
							if(airgun_val[rgb_val.html_chute]>=64) {
								airgun_val[rgb_val.html_chute] = 64;
								clearInterval(timer);
							}
							$("#channel_val").val(airgun_val[rgb_val.html_chute]);
							break;	
			}
			//console.log('airgun_val[rgb_val.html_chute]: '+airgun_val[rgb_val.html_chute]);
			
		}, 100);
	});
	
	// channel value up and down
	// airgun_addr.channel, airgun_val.channel
	$(".channel_button").click(function(){
		
		switch(this.id){
			case 'channel_down':	
						airgun_val[rgb_val.html_chute] = parseInt(airgun_val[rgb_val.html_chute])-1;	
						if(airgun_val[rgb_val.html_chute]<=1) {
							clearInterval(timer);
							airgun_val[rgb_val.html_chute] = 1;
						}	
						$("#channel_val").val(airgun_val[rgb_val.html_chute]);
						break;
			case 'channel_up':
						airgun_val[rgb_val.html_chute] = parseInt(airgun_val[rgb_val.html_chute])+1;	
						if(airgun_val[rgb_val.html_chute]>=64) {
							airgun_val[rgb_val.html_chute] = 64;
							clearInterval(timer);
						}
						$("#channel_val").val(airgun_val[rgb_val.html_chute]);
						break;	
		}
		//console.log('airgun_val[rgb_val.html_chute]: '+airgun_val[rgb_val.html_chute]);
		
		// checkbox refresh
		checkbox_false();
		$("#check [id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);
		$('#check').buttonset("refresh");
		
		if( $("#start_stop").val() == 1) { // start bt enable
			// channel_button data
			Command = '4';
			address = airgun_addr.channel;	// RGB_A or RGB_B
			value = (airgun_val[rgb_val.html_chute]-1).toString();	// must be toString()
			socket_emit(ID, Command, address, value);
		}
		
	});
	
	// default: 0b, html value:0
	$("#start_stop").click(function() {
		
		if( this.value == 0 ) {	// start enable
			this.value = 1;
			$("#start_stop").html('START').css('background', '#D5FFE8');			
			
			rgb_val.chute = 1;
								
			// 2^0 ~ 2^7
			for(var i=0; i<(rgb_val.html_chute-1); i++){
				rgb_val.chute*=2;
			}					
			//console.log('rgb_val.chute value: ' + rgb_val.chute);
			
			// Manual/Auto value Check
			if( $("#manual_auto").val() == 1) {
				//console.log('auto start');
				auto_timer = setInterval(auto_airgun_test, 1000);	// auto start
			} 
			
			// checkbox button refresh
			checkbox_false();
			error_marking();
			
			$("#check [id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);
			$("#check").buttonset("refresh");
			
		} else {	// stop enable
			
			this.value = 0;	
								
			rgb_val.chute = this.value;
			//rgb_val.html_chute = this.value;
			$("#start_stop").html('STOP').css('background', '#6DCBB0');
			
			if( $("#manual_auto").val() == 1) {
				clearInterval(auto_timer);	// auto stop
			}

		}
		
		Command = '4';				
		address = rgb_addr.part;			// RGB_A or RGB_B
		value = rgb_val.chute.toString();	// must be toString()
		socket_emit(ID, Command, address, value);

		Command = '4';
		address = airgun_addr.channel;	// RGB_A or RGB_B
		value = (airgun_val[rgb_val.html_chute]-1).toString();	// must be toString()
		socket_emit(ID, Command, address, value);
	
	});
	
	function checkbox_false() {
		for(var i=0; i<64; i++) {
			$("#check input[id=checkbox"+(i+1)+"]").prop("checked", false);
		}	
	}
	
	function airgun_auto_start() {
		
		//console.log('auto airgun chute change func start');	
		clearInterval(auto_start_timer);
		
		$("#start_stop").html('START').css('background', '#D5FFE8');	// start enable
		$("#start_stop").val(1);	// start enable
						
		// RGB A1~A6, B1~B6 Data start
		rgb_val.chute = 1;
		
		// 2^0 ~ 2^7
		for(var i=0; i<(rgb_val.html_chute-1); i++){
			rgb_val.chute*=2;
		}					
		//console.log('rgb_val.chute value: ' + rgb_val.chute);
		
		Command = '4';
		address = rgb_addr.part;			// RGB_A or RGB_B
		value = rgb_val.chute.toString();	// must be toString()
		socket_emit(ID, Command, address, value);
		// RGB A1~A6, B1~B6 Data end
		
		auto_timer = setInterval(auto_airgun_test, 1000);
		
		//console.log('auto airgun chute change func end');
	}
	
	var auto_cnt=1, auto_chute_cnt=1, chute_flag=0;
	function auto_airgun_test() {
		
		if(airgun_val[rgb_val.html_chute] > 64) {
			
			console.log('airgun_val[rgb_val.html_chute] > 64');
			
			// auto stop: (model_val.channel+1) +1 is mode_val.channel 0~5
			if ( rgb_val.html_chute >= (model_val.channel+1) ) {
				
				console.log('rgb_val.html_chute > (model_val.channel+1)');
				
				// chute selectmenu button refresh flag setting
				rgb_val.html_chute = (model_val.channel+1);		// +1 is mode_val.channel 0~5
				console.log('auto stop html chute: ' + rgb_val.html_chute);
				
				// auto stop: airgun value init 1
				for(var i=1; i<=rgb_val.html_chute; i++) {
					airgun_val[''+i] = 1;
				}
				
				// auto end: manual change
				$("#manual_auto").val(0);
				$("#manual_auto").html("MANUAL").css('background', '#6DCBB0');
				
				// airgun stop start
				Command = '4';
				address = rgb_addr.part;	// RGB_A or RGB_B
				value = '0';				// airgun check stop value: must be toString()
				socket_emit(ID, Command, address, value);
				
				$("#start_stop").html('STOP').css('background', '#6DCBB0');	// stop enable
				$("#start_stop").val(0);	// stop enable
				
				clearInterval(auto_timer);	// auto_airgun_test stop
				// airgun stop end ===
				
				// eject off
				address =  Eject_Feed_onoff_addr.EjectOnOff;
				value = '0';  	// must be "toString()"
				socket_emit(ID, Command, address, value);
				Eject_Feed_onoff_val.EjectOnOff = 0;
				$("#eject").html("EJECT OFF").css("background", "#6DCBB0");
				
				// feed off
				address =  Eject_Feed_onoff_addr.FeedOnOff;
				value = '0';  	// must be "toString()"
				socket_emit(ID, Command, address, value);
				Eject_Feed_onoff_val.FeedOnOff = 0;
				$("#feed").html("FEED OFF").css("background", "#6DCBB0");
				
			} else {
				
				airgun_val[rgb_val.html_chute]=1;	// current html_chute value init
				rgb_val.html_chute++;				// chute add
			
				$("#chute_list option[value="+rgb_val.html_chute+"]").prop("selected", true);
				$('#chute_list').selectmenu('refresh', true);
				
				$("#start_stop").html('STOP').css('background', '#6DCBB0');	// stop enable
				$("#start_stop").val(0);	// stop enable
			
				// stop value emit
				Command = '4';
				address = rgb_addr.part;	// RGB_A or RGB_B
				value = '0';				// airgun check stop value: must be toString()
				socket_emit(ID, Command, address, value);

								
				// RGB A1~A6, B1~B6 Data start ===
				rgb_val.chute = 1;
				
				// 2^0 ~ 2^7
				for(var i=0; i<(rgb_val.html_chute-1); i++) {
					rgb_val.chute*=2;
				}					
				//console.log('rgb_val.chute value: ' + rgb_val.chute);
				
				$("#start_stop").html('START').css('background', '#D5FFE8');	// start enable
				$("#start_stop").val(1);	// start enable
				
				Command = '4';
				address = rgb_addr.part;			// RGB_A or RGB_B
				value = rgb_val.chute.toString();	// must be toString()
				socket_emit(ID, Command, address, value);
				// RGB A1~A6, B1~B6 Data end ===
					
				airgun_val['past_'+rgb_val.html_chute] = airgun_val[rgb_val.html_chute];
			
				//console.log('function auto_airgun_test!!');
				checkbox_false();
				error_marking();
				
				/* checkbox button refresh start */
				$("#check [id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);
																		
				// -1: past value false
				$("#check [id=checkbox"+(airgun_val[rgb_val.html_chute]-1)+"]").prop("checked", false);
				
				// chute value display
				$("#chute_val").val(rgb_val.html_chute);
				
				// channel value display
				$("#channel_val").val(airgun_val[rgb_val.html_chute]);
				
				$('#check').buttonset("refresh");
				/* checkbox button refresh end */
				
				Command = '4';
				address = airgun_addr.channel;
				value = (airgun_val[rgb_val.html_chute]-1).toString();
				socket_emit(ID, Command, address, value);
				airgun_val[rgb_val.html_chute]++;	// check: airgun channel value add
			}
			
		} else {
			airgun_val['past_'+rgb_val.html_chute] = airgun_val[rgb_val.html_chute];
		
			//console.log('function auto_airgun_test!!');
			checkbox_false();
			error_marking();
			
			/* checkbox button refresh start */
			$("#check [id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);
																	
			// -1: past value false
			$("#check [id=checkbox"+(airgun_val[rgb_val.html_chute]-1)+"]").prop("checked", false);
			
			// chute value display
			$("#chute_val").val(rgb_val.html_chute);
			
			// channel value display
			$("#channel_val").val(airgun_val[rgb_val.html_chute]);
			
			$('#check').buttonset("refresh");
			/* checkbox button refresh end */
			
			Command = '4';
			address = airgun_addr.channel;
			value = (airgun_val[rgb_val.html_chute]-1).toString();
			socket_emit(ID, Command, address, value);
			airgun_val[rgb_val.html_chute]++;	// check: airgun channel value add					 	
			
		}
		
		 
	}
	
	// chute_flag 는 chute가 바뀔 때 한번 만 바뀜
	function auto_airgun_test_old() {
		
		airgun_val['past_'+rgb_val.html_chute] = airgun_val[rgb_val.html_chute];
		
		//console.log('function auto_airgun_test!!');
		checkbox_false();
		error_marking();
		
		/* checkbox button refresh start */
		$("#check [id=checkbox"+airgun_val[rgb_val.html_chute]+"]").prop("checked", true);
																
		// -1: past value false
		$("#check [id=checkbox"+(airgun_val[rgb_val.html_chute]-1)+"]").prop("checked", false);
		
		// chute value display
		$("#chute_val").val(rgb_val.html_chute);
		
		// channel value display
		$("#channel_val").val(airgun_val[rgb_val.html_chute]);
		
		$('#check').buttonset("refresh");
		/* checkbox button refresh end */
		
		if ( chute_flag == 1 ) {
			$("#chute_list option[value="+rgb_val.html_chute+"]").prop("selected", true);
			$('#chute_list').selectmenu('refresh', true);
				
			/* RGB A1~A6, B1~B6 Data start */
			$("#start_stop").html('STOP').css('background', '#6DCBB0');	// stop enable
			$("#start_stop").val(0);	// stop enable
			
			Command = '4';
			// stop value emit
			address = rgb_addr.part;	// RGB_A or RGB_B
			value = '0';	// airgun check stop value: must be toString()
			socket_emit(ID, Command, address, value);
			/* RGB A1~A6, B1~B6 Data end */
			
			clearInterval(auto_timer);	// auto stop(END)
			auto_start_timer = setInterval(airgun_auto_start, 200);
			chute_flag = 0;
		}	
		else {
			
			Command = '4';
			address = airgun_addr.channel;
			value = (airgun_val[rgb_val.html_chute]-1).toString();
			socket_emit(ID, Command, address, value);

			airgun_val[rgb_val.html_chute]++;	// check: airgun channel value add
			
			if(airgun_val[rgb_val.html_chute] > 64) {
				airgun_val[rgb_val.html_chute]=64;	// current html_chute value init
				rgb_val.html_chute++;				// chute add
				chute_flag = 1;						// channel value is 64: flag
			}
			
			// auto stop: (model_val.channel+1) +1 is mode_val.channel 0~5
			if ( rgb_val.html_chute > (model_val.channel+1) ) {
				
				// chute selectmenu button refresh flag setting
				rgb_val.html_chute = (model_val.channel+1);		// +1 is mode_val.channel 0~5
				console.log('auto stop html chute: ' + rgb_val.html_chute);
				
				// auto stop: airgun value init 1
				for(var i=1; i<rgb_val.html_chute; i++) {
					airgun_val[''+i] = 1;
				}
				
				clearInterval(auto_timer);	// auto stop(END)
				chute_flag = 0;
				
				// auto end: manual change
				$("#manual_auto").val(0);
				$("#manual_auto").html("MANUAL").css('background', '#6DCBB0');
				
				/* RGB A1~A6, B1~B6 Data start */
				// stop value emit
				Command = '4';
				address = rgb_addr.part;	// RGB_A or RGB_B
				value = '0';				// airgun check stop value: must be toString()
				socket_emit(ID, Command, address, value);
				
				$("#start_stop").html('STOP').css('background', '#6DCBB0');	// stop enable
				$("#start_stop").val(0);	// stop enable
				/* RGB A1~A6, B1~B6 Data end */
				
				// eject off
				address =  Eject_Feed_onoff_addr.EjectOnOff;
				value = '0';  	// must be "toString()"
				socket_emit(ID, Command, address, value);
				
				Eject_Feed_onoff_val.EjectOnOff = 0;
				$("#eject").html("EJECT OFF").css("background", "#6DCBB0");
				
				// feed off
				address =  Eject_Feed_onoff_addr.FeedOnOff;
				value = '0';  	// must be "toString()"
				socket_emit(ID, Command, address, value);
				
				Eject_Feed_onoff_val.FeedOnOff = 0;
				$("#feed").html("FEED OFF").css("background", "#6DCBB0");
			}
		}
	}
	
	/* manual_auto button event: toggle, value default:0(manual)*/
	$('#manual_auto').click( function() {
		
		if( $("#manual_auto").val() == 0) {	// auto enable
			
			if( $("#start_stop").val() == 1 ) {
				auto_timer = setInterval(auto_airgun_test, 1000);	// auto start
			}
			
			$("#manual_auto").val(1);
			$("#manual_auto").html("AUTO").css('background', '#D5FFE8');
			//console.log('auto: '+$("#manual_auto").val());
			
		} else {	// auto disable
			
			if( $("#start_stop").val() == 1 ) {
				clearInterval(auto_timer);	// auto stop(END)
			}
			
			$("#manual_auto").val(0);
			$("#manual_auto").html("MANUAL").css('background', '#6DCBB0');
			//console.log('manual: '+ $("#manual_auto").val());
		}
	});
	
	function error_marking() {
		// console.log('marking length: ' + marking_ch_num[rgb_val.html_chute].length );
		for(var i=0; i<marking_ch_num[rgb_val.html_chute].length; i++) {
			$("#check input[id=checkbox"+marking_ch_num[rgb_val.html_chute][i]+"]").prop("checked", true);
		}
	}
	
	// marking click event
	$('#marking').click( function() {
		
		// marking number push
		if( ($("#manual_auto").val()==1) && ($("#start_stop").val()==1) ) {		
			marking_ch_num[rgb_val.html_chute].push(airgun_val['past_'+rgb_val.html_chute]);
		} else {
			marking_ch_num[rgb_val.html_chute].push(airgun_val[rgb_val.html_chute]);	
		}
	
		// marking_ch_num length minus
		for(var i=0; i < marking_ch_num[rgb_val.html_chute].length; i++) {
			
			for(var j=i; j<marking_ch_num[rgb_val.html_chute].length-1; j++) {
				
				if( marking_ch_num[rgb_val.html_chute][i] == marking_ch_num[rgb_val.html_chute][j+1] ) {
					delete marking_ch_num[rgb_val.html_chute][i+j+1];
					marking_ch_num[rgb_val.html_chute].length-=1;
				}
			}
		}
		
		//console.log('marking all num: '+ marking_ch_num[rgb_val.html_chute]);
		//console.log('marking_array length: '+marking_ch_num[rgb_val.html_chute].length);
		
		error_marking();
		//$("#check").buttonset("refresh");
		
	});
	
	$('#clear').click( function() {
		//console.log('clear event');
		
		checkbox_false();
		
		$('#check').buttonset("refresh");
		
		// marking array all delete
		for(var i=0; i < marking_ch_num[rgb_val.html_chute].length; i++) {
			delete marking_ch_num[rgb_val.html_chute][i+1];
		}
		
		// length = 0
		marking_ch_num[rgb_val.html_chute].length=0;
	});
	// Airgun Dialog Event end
	
	// Help Dialog event start ============
	socket.on('help_res', function(data) {		// help event response: server -> web
		
		console.log( data );
		if( data.wired == 'Not connected.' )
			$("#my-ip-wired").val(data.wired);
		else $("#my-ip-wired").val(data.wired+':3000');
		
		if( data.wireless == 'Not connected.' )
			$("#my-ip-wireless").val(data.wireless);
		else $("#my-ip-wireless").val(data.wireless+':3000');
		
	});
	
	var help_dlg_toggle = 0;
	$('#help').click( function() {
		
		if( help_dlg_toggle == 0 ) {

			All_Dialog_Close();
			
			$(help_Dlg).dialog("open");
			// IP address read req: web->server
			socket.emit('help_req');
			help_dlg_toggle = 1;
			
		} else {
			$(help_Dlg).dialog("close");
			help_dlg_toggle = 0;
		}
		
	});
	
	$('#help-exit').click( function() {
		//console.log('help exit');
		
		clearInterval(err_check_timer);
		
		self.opener = self;
		window.opener = window.location.href;
		window.open('about:blank', '_self').close();
		window.close();
		self.close();	// browser exit
	});
	// Help Dialog event end ============
	
	function ReadAVR_M_memory_image() { 
		socket_emit(protocol_HTML_server.ID, protocol_HTML_server.Command, protocol_HTML_server.device_address, protocol_HTML_server.value);
	}
	
	function dec2hex(i) {
		var result = "000";
		if (i >= 0    && i <= 15) { 
			result = "00" + i.toString(16); 
		}
		else { 
			result = "0"  + i.toString(16); 
		}
		return result;
	}

	function Read_All_AVR_M_Data() {
		
		if( program_init_flag == 0) {
			
			console.log( 'program_init_flag is 0 : Avr Data Read' );
			// Mode Name Read
			for(var key in mode_name_addr) {
				
				var dec;
				dec = parseInt(mode_name_addr[key], 16);
				protocol_HTML_server.device_object = "mode_name_val";
				for( var i=0; i<20; i++ ) {
					mode_name_arr[i] = dec2hex(dec).toString();
					
					// Object value(device address)	
					protocol_HTML_server.device_address = '0x'+mode_name_arr[i];
					protocol_HTML_server.device_key = key;	// Object Member	
					protocol_HTML_server.value ='0';		// don't care.
					protocol_HTML_server.Command = '2';
					ReadAVR_M_memory_image();
					
					dec++;
				}
				// console.log( 'addr : ' + mode_name_arr );
			}
			
		} else {
			
			socket.emit('mode_name_read');
			console.log( 'program_init_flag is 1 : Server Data Read' );
		}
						
		// Mode value read
		for(var key in mode_addr) {
		
			protocol_HTML_server.device_object = "mode_val";		// Object Name
			protocol_HTML_server.device_address = mode_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;					// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
				// Model value read
		for(var key in model_addr) {
		
			protocol_HTML_server.device_object = "model_val";		// Object Name
			protocol_HTML_server.device_address = model_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;					// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// feed adv values
		for(var key in adv_feed_addr) {
		
			protocol_HTML_server.device_object = "adv_feed_val";			// Object Name
			protocol_HTML_server.device_address = adv_feed_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// main values 1st
		for(var key in device_addr_1) {
		
			protocol_HTML_server.device_object = "device_val_1";			// Object Name
			protocol_HTML_server.device_address = device_addr_1[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';
 
			ReadAVR_M_memory_image();
		}
		
		// main values 2nd
		for(var key in device_addr_2) {
		
			protocol_HTML_server.device_object = "device_val_2";			// Object Name
			protocol_HTML_server.device_address = device_addr_2[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// main values 3rd
		for(var key in device_addr_3) {
		
			protocol_HTML_server.device_object = "device_val_3";			// Object Name
			protocol_HTML_server.device_address = device_addr_3[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// Eject, Feed value read
		for(var key in Eject_Feed_onoff_addr) {
			protocol_HTML_server.device_object = "Eject_Feed_onoff_val";			// Object Name
			protocol_HTML_server.device_address = Eject_Feed_onoff_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		//console.log('Eject, Feed value read done');
		
		for(var key in B_D_S_CamAddr) {
			protocol_HTML_server.device_object = "B_D_S_CamVal";			// Object Name
			protocol_HTML_server.device_address = B_D_S_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in B_D_C_CamAddr) {
			protocol_HTML_server.device_object = "B_D_C_CamVal";			// Object Name
			protocol_HTML_server.device_address = B_D_C_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in B_L_S_CamAddr) {
			protocol_HTML_server.device_object = "B_L_S_CamVal";			// Object Name
			protocol_HTML_server.device_address = B_L_S_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in B_L_C_CamAddr) {
			protocol_HTML_server.device_object = "B_L_C_CamVal";			// Object Name
			protocol_HTML_server.device_address = B_L_C_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in G_D_S_CamAddr) {
			protocol_HTML_server.device_object = "G_D_S_CamVal";			// Object Name
			protocol_HTML_server.device_address = G_D_S_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in G_D_C_CamAddr) {
			protocol_HTML_server.device_object = "G_D_C_CamVal";			// Object Name
			protocol_HTML_server.device_address = G_D_C_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		
		for(var key in G_L_S_CamAddr) {
			protocol_HTML_server.device_object = "G_L_S_CamVal";			// Object Name
			protocol_HTML_server.device_address = G_L_S_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in G_L_C_CamAddr) {
			protocol_HTML_server.device_object = "G_L_C_CamVal";			// Object Name
			protocol_HTML_server.device_address = G_L_C_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in R_D_S_CamAddr) {
			protocol_HTML_server.device_object = "R_D_S_CamVal";			// Object Name
			protocol_HTML_server.device_address = R_D_S_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in R_D_C_CamAddr) {
			protocol_HTML_server.device_object = "R_D_C_CamVal";			// Object Name
			protocol_HTML_server.device_address = R_D_C_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in R_L_S_CamAddr) {
			protocol_HTML_server.device_object = "R_L_S_CamVal";			// Object Name
			protocol_HTML_server.device_address = R_L_S_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		for(var key in R_L_C_CamAddr) {
			protocol_HTML_server.device_object = "R_L_C_CamVal";			// Object Name
			protocol_HTML_server.device_address = R_L_C_CamAddr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// cleaning values read
		for(var key in cleaning_addr) {
			protocol_HTML_server.device_object = "cleaning_val";			// Object Name
			protocol_HTML_server.device_address = cleaning_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// ejecting values read
		for(var key in ejecting_addr) {
			protocol_HTML_server.device_object = "ejecting_val";			// Object Name
			protocol_HTML_server.device_address = ejecting_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// lighting values read
		for(var key in lighting_addr) {
			protocol_HTML_server.device_object = "lighting_val";			// Object Name
			protocol_HTML_server.device_address = lighting_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// Camera on off values read
		for(var key in camera_onoff_addr) {
			protocol_HTML_server.device_object = "camera_onoff_val";			// Object Name
			protocol_HTML_server.device_address = camera_onoff_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// back_front_addr values read
		for(var key in back_front_addr) {
			protocol_HTML_server.device_object = "back_front_val";			// Object Name
			protocol_HTML_server.device_address = back_front_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
		// back_rear_addr values read
		for(var key in back_rear_addr) {
			protocol_HTML_server.device_object = "back_rear_val";			// Object Name
			protocol_HTML_server.device_address = back_rear_addr[key];	// Object value(device address)	
			protocol_HTML_server.device_key = key;						// Object Member	
			protocol_HTML_server.value ='0';		// don't care.
			protocol_HTML_server.Command = '2';

			ReadAVR_M_memory_image();
		}
		
	}
	
}
