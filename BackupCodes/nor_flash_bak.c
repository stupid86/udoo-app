u08 byH[64], byS[64], byL[64];

u08 Max(u08 x, u08 y, u08 z)
{
	 return x > y ? (x > z ? x : z) : (y > z ? y : z);
}

u08 Min(u08 x, u08 y, u08 z)
{
	 return x < y ? (x < z ? x : z) : (y < z ? y : z);
}

void HslLookUpTable(void)
{
	u32	dwRGB, lDel, lTemp;
	u16 wTemp;
//	u08 byH[64], byS[64], byL[64];
	u08 byR, byG, byB, byMax, byMin, byDel;
	u08 cCNT;
//	double dMax, dMin;

	for(dwRGB = 0; dwRGB < 262144; dwRGB += 64)
	{
		wTemp =  (u16)dwRGB >> 8;
		byR = (u08)wTemp >> 8;
		byG = (u08)wTemp;
		byB = (u08)dwRGB;
		if(tbi(byG,3))	cbi(bPORT_LED,nLED0);	//led on
		else				sbi(bPORT_LED,nLED0);	//led on
		byNorFlashAddr[0] = byR;
		byNorFlashAddr[1] = byG;
		byNorFlashAddr[2] = byB;
		//byNorFlashAddr[2] = byR;
		//byNorFlashAddr[1] = byG;
		//byNorFlashAddr[0] = byB;
		for(cCNT = 0; cCNT < 64; cCNT++)
		{
			byMax = Max(byR, byG, byB);
			byMin = Min(byR, byG, byB);
			byL[cCNT] = (byMax + byMin + 1) >> 1;
			if(Max == Min)
			{
				byH[cCNT] = 0;
				byS[cCNT] = 0;
			}
			else
			{
				byDel = byMax - byMin;
				wTemp = (u16)byDel << 8;
				lDel = (u32)wTemp << 8;
				byS[cCNT] = byL[cCNT] > 127 ? (u08)((lDel / (u32)(512 - byMax - byMin))>>8) : (u08)((lDel / (u32)(byMax + byMin))>>8);
				if(byMax == byR)
				{
					if(byG < byB)
					{
						lTemp = (u32)((byB - byG)<<8);
						lTemp <<= 8;
						lTemp = lTemp / (u32)byDel;
						lTemp = 393216 - lTemp;
						lTemp >>= 8;
						byH[cCNT] = (u08)lTemp / 6;
					}
					else
					{
						lTemp = (u32)((byG - byB)<<8);
						lTemp <<= 8;
						lTemp = lTemp / (u32)byDel;
						lTemp >>= 8;
						byH[cCNT] = (u08)lTemp / 6;
					}
				}
				else if(byMax == byG)
				{
					if(byB < byR)
					{
						lTemp = (u32)((byR - byB)<<8);
						lTemp <<= 8;
						lTemp = lTemp / (u32)byDel;
						lTemp = 131072 - lTemp;
						lTemp >>= 8;
						byH[cCNT] = (u08)lTemp / 6;
					}
					else
					{
						lTemp = (u32)((byB - byR)<<8);
						lTemp <<= 8;
						lTemp = lTemp / (u32)byDel;
						lTemp += 131072;
						lTemp >>= 8;
						byH[cCNT] = (u08)lTemp / 6;
					}
				}
				else if(byMax == byB)
				{
					if(byR < byG)
					{
						lTemp = (u32)((byG - byR)<<8);
						lTemp <<= 8;
						lTemp = lTemp / (u32)byDel;
						lTemp = 262144 - lTemp;
						lTemp >>= 8;
						byH[cCNT] = (u08)lTemp / 6;
					}
					else
					{
						lTemp = (u32)((byR - byG)<<8);
						lTemp <<= 8;
						lTemp = lTemp / (u32)byDel;
						lTemp += 262144;
						lTemp >>= 8;
						byH[cCNT] = (u08)lTemp / 6;
					}					
				}
			}
			byB += 1;
		}
		WriteBufferPrograming(&NorFlashCtrl, &NorFlashState);
	}
}