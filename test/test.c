//直行车辆变道
switch (lc) //lc:lane changes 变道，
{ 
	case 0://中间车道向左车道变道 
		保持身份不变，所属排队链仍为中间车道排队链； 
		break; 
	case 1://中间车道向右侧车道变道 
		if(isF ir st)//判断是否成为该车道队列首车 
			isheader = true;//成为组汇聚节点 
			identity ChangeQ;//通知原汇聚节点移交身份
			sendAnnounce();//发出组汇聚节点通告信息
		else
			向右车道组汇聚节点发送自身信息，加入右车道排队链；
		endif 
		break 
	case 2://左侧车道向中间车道变道，左侧车道的直行车辆是属于中间车道的。 
		if(isFirst) 
			isheader = true; 
			identity Change(); 
			sendAnnounce(); 
		else 
			保持不变； 
		endif 
		break; 
	case 3://右侧车道向中间车道变道 
		if(isFirst) 
			isheader = true; 
			identityChange(); 
			sendAnnounce(); 
		else 
			向中间车道组汇聚节点发送自身信息，加入中间车道排队链； 
		break
}

//左转车辆变道： 
switch (lc)
{ 
	case 0://中间车道向左车道变道 
		if(isFirst) 
			isheader = true; 
			identity Change(); 
			sendAnnounce(); 
		else 
			保持身份不变，所属排队链仍为左侧车道排队链； 
		endif 
		break; 
	case 1://中间车道向右侧车道变道 
	case 2://左侧车道向中间车道变道 
	case 3://右侧车道向中间车道变道 
		保持身份不变，所属排队链仍为左侧车道排队链； 
		break
}

//右转车辆变道：
switch (lc)
{ 
	case 0://中间车道向左车道变道 
		保持身份不变，所属排队链仍为中间车道排队链； 
		break 
	case 1://中间车道向右侧车道变道 
		if(isFirst) 
			成为自由节点； 
		else 
			保持身份不变，所属排队链仍为中间车道排队链； 
		endif 
		break; 
	case 2://左侧车道向中间车道变道 
	case 3://右侧车道向中间车道变道 
		保持身份不变，所属排队链仍为中间车道排队链； 
	break
}