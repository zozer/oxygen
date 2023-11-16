//!/usr/local/shared_bin/python/python-2.7.2/ES5-64/bin/python
// -*- coding: UTF-8 -*-
//----------------------------------------------------------------------------
// Name:         Oxygen delivery model
// Authors:      Andrew Bretherick, Kenneth Baillie
// Copyright:    Bretherick, Baillie 2018
// Contact:      j.k.baillie@baillielab.net
//----------------------------------------------------------------------------

//import { brentq, newton } from "./MathFuntions"

var timelimit = 30
var verbose = false
var debugging = false
var mbc = false // mass balance check

var toleranceoferror_so2 =    1e-7
var toleranceoferror_lung =    0.00001
var toleranceoferror_organ = 0.00001
var toleranceoferror_ph =    0.00001
var VO2correctionspeed =    3 // normally 3; faster has higher chance of oscillation
var globaldifftolerance =    0.01
var num_lung_compartments = 20
//http {//www.sciencedirect.com/science/article/pii/S0378381204002717                        
// Otswald coeff is functionined as vg/vl 
// (the total volume of dissolved gas over the total volume of liquid solution after equilibrium is reached)                        
//------------
var scO2dict={
    "air": 1,
    }
//------------
var scCO2dict={
    "air": 1,
    }
//------------
var Pbar = 101.325 // the barometric pressure at which these solubility coefficients apply
//------------

//----------------------------------------------------------------------------
// Name:        Imported functions
//----------------------------------------------------------------------------

/*RR = 12.0
VT = 0.475
VD = 0.11
fio2 = 0.21
alt = 0
CO = 6.5
pulm_shunt = 0.02
DmO2 = 300
Vc = 0.075
Hb = 150
BE = 0
DPG = 0.00465
MCHC = 340
VO2 = 0.25
Temp = 309.65
tissue_shunt = 0.05
RQ = 0.8
ecmosites = []
Qecmo = 0
hetindex = 0
maxruns = 100
debugging = False
outfile = 'null'*/
//----------------------------------------------------------------------------
// Name:         Import user values if working online
//----------------------------------------------------------------------------
// detect the source of input variables automatically
function getinputs(data) {
    var variables = {
        'RR':           setunits(data.RR            ,'bpm'),
        'VT':           setunits(data.VT            ,data.VT_unit),
        'VD':           setunits(data.VD            ,data.VD_unit),
        'fio2':         setunits(data.fio2          ,'%'),
        'alt':          setunits(data.alt           ,data.alt_unit),
        'CO':           setunits(data.CO            ,data.CO_unit),
        'pulm_shunt':   setunits(data.pulm_shunt    ,'fraction'),
        'DmO2':         setunits(data.DmO2          ,'mlO2/min/kPa'),
        'Vc':           setunits(data.Vc            ,data.Vc_unit),
        'Hb':           setunits(data.Hb            ,data.Hb_unit),
        'BE':           setunits(data.BE            ,'mEq/l'),
        'DPG':          setunits(data.DPG           ,data.DPG_unit),
        'MCHC':         setunits(data.MCHC ?? 340   ,'g/l'),
        'VO2':          setunits(data.VO2           ,'ml/min'),
        'Temp':         setunits(data.Temp          ,data.Temp_unit),
        'tissue_shunt': setunits(data.tissue_shunt  ,'fraction'),
        'RQ':           setunits(data.RQ            ,'fraction'),
        'hetindex':     data.hetindex ?? 0,
        'ecmosites':    data.ecmosites ?? [],
        'Qecmo':        data.Qecmo ?? 0,
        'maxruns':      data.maxruns ?? 100
    }
    return variables;
}

//----------------------------------------------------------------------------
// Name:         Unit Conversion
// Purpose:      Convert to SI units
//----------------------------------------------------------------------------
function setunits(value,unit) {
    // Mass
    if (unit == 'kg') {
        return value
    }
    else if (unit == 'stone') {
        return value*6.35029318
    }
    else if (unit == 'lb') {
        return value*0.45359237
    }
    // Length
    else if (unit == 'm') {
        return value
    }
    else if (unit == 'feet') {
        return value*0.3048
    }
    else if (unit == 'ft') {
        return value*0.3048
    }
    // Temperature
    else if (unit == 'deg C') {
        return value+273.15
    }
    else if (unit == 'deg F') {
        return (5*(value-32)*9**-1)+273.15
    }
    else if (unit =='K') {
        return value
    }
    // Concentration
    else if (unit == 'mmol/l') {
        return value*1e-3
    }
    else if (unit == 'mol/l') {
        return value
    }
    else if (unit == 'mEq/l') {
        return value*1e-3
    }
    else if (unit == 'Eq/l') {
        return value
    }
    // Haemoglobin
    else if (unit == 'g/dl') {
        return value*10
    }
    else if (unit == 'g/l') {
        return value
    }
    // Unitless
    else if (unit == 'fraction') {
        return value
    }
    else if (unit == '%') {
        return value*1e-2
    }
    else if (unit == 'unitless') {
        return value
    }
    // Volume
    else if (unit == 'ml') {
        return value*1e-3
    }
    else if (unit =='l') {
        return value
    }
    // Rate
    else if (unit == 'l/min') {
        return value
    }
    else if (unit == 'ml/min') {
        return value*10**-3
    }
    else if (unit == 'bpm') {
        return value
    }
    else if (unit == 'mlO2/min/kPa') {
        return value
    }
    // Error
    else {
        return 'Unit conversion error'
    }
}
//----------------------------------------------------------------------------
// Name:        Input Constants
//----------------------------------------------------------------------------
// Fractional water contents
const Wpl = 0.94 // plasma
const Wrbc = 0.65 // red blood cells
// Constants from Dash and Bassingthwaight 2010
const n0 = 1.7 // unitless
const K_1 = 7.43e-7 // M
const K_prime_1 = 1.35*10**-3 // unitless
const K_2prime_1 = 5.5*10**-4 // M
const K_2 = 2.95*10**-5 // unitless
const K_2prime_2 = 1*10**-6 // M
const K_prime_2 = K_2*K_2prime_2**-1 // M**-1
const K_3 = 2.51*10**-5 // unitless
const K_2prime_3 = 1*10**-6 // M
const K_prime_3 = K_3*K_2prime_3**-1 // M**-1
//K_2prime_4 = 202123 # M**-1
const K_2prime_5 = 2.63*10**-8 // M
const K_2prime_6 = 1.91*10**-8 // M
// Constants from Wagner & Pruss 1993
const Temp_critical = 647.096 // K
const Pres_critical = 22.064e3 // kPa
const a1 = -7.85951783
const a2 = 1.84408259
const a3 = -11.7866497
const a4 = 22.6807411
const a5 = -15.9618719
const a6 = 1.80122502
// Standard temperature and pressure
const R = 8.3145 // J.K**-1.mol**-1
const STP_T = 273.15 // K
const STP_P = 101.325 // kPa
// Standard bicarbonate
const StdBicarb = 24.5e-3 // M
const Constants = {
    Pres:0,
    PH2O:0,
    PIO2:0,
    HbMol:0,
    Hct:0,
    Wbl:0,
    VA:0,
    VQ:0,
    alphaO2:0,
    alphaCO2:0,
    BE:0,
    trueVO2:0
}
//----------------------------------------------------------------------------
// Name:        Calculated Constants
//----------------------------------------------------------------------------
function calculatedconstants(variables) {
    //------------------------------------------------------------------------
    // Name:         Atmospheric pressure (kPa) from altitude (m)
    // Source:    West 1996
    //------------------------------------------------------------------------
    Constants.Pres = Math.exp(6.63268-0.1112*(variables.alt*1e-3)-0.00149*(variables.alt*1e-3)**2)*0.1333 // kPa
    //------------------------------------------------------------------------
    // Name:         Saturated vapour pressure of water (kPa)
    // Source:       Wagner & Pruss 1993
    //------------------------------------------------------------------------
    var tau = 1 - variables.Temp*Temp_critical**-1 // fraction
    Constants.PH2O = Pres_critical*Math.E**(Temp_critical*variables.Temp**-1*(a1*tau+a2*tau**1.5+a3*
        tau**3+a4*tau**3.5+a5*tau**4+a6*tau**7)) // kPa
    //------------------------------------------------------------------------
    // Name:         Constants.PIO2
    //------------------------------------------------------------------------
    Constants.PIO2 = variables.fio2*(Constants.Pres-Constants.PH2O) // kPa
    //------------------------------------------------------------------------
    // Name:         [variables.Hb]
    //------------------------------------------------------------------------
    Constants.HbMol = variables.Hb*64458**-1 // M
    Constants.Hct  = variables.Hb/variables.MCHC
    //------------------------------------------------------------------------
    // Name:         Fractional water space of blood
    //------------------------------------------------------------------------
    Constants.Wbl = (1-Constants.Hct)*Wpl+Constants.Hct*Wrbc // fraction
    //------------------------------------------------------------------------
    // Name:         Alveolar Ventilation
    //------------------------------------------------------------------------
    Constants.VA = variables.RR*(variables.VT-variables.VD) // l/min
    Constants.VQ = Constants.VA*(variables.CO*(1-variables.pulm_shunt))**-1
    //------------------------------------------------------------------------
    // Name:         alpha O2 / CO2
    // Source:       Dash & Bassingthwaight 2010
    //------------------------------------------------------------------------
    Constants.alphaO2 = alphaO2_func(variables.Temp, Wpl) // M/kPa
    Constants.alphaCO2 = alphaCO2_func(variables.Temp, Wpl) // M/kPa
    //------------------------------------------------------------------------
    //----------- AND FIX INPUT UNITS
    Constants.BE = variables.BE/1000 // input is mEq/l
    Constants.trueVO2 = variables.VO2 // user-functionined variables.VO2 is an aspiration...
    //------------------------------------------------------------------------
}
function print_input_variables(variables) {
    for (var prop in variables) {
        console.log(`${prop}: ${variables[prop]}`)
    }
}
//-###########################################################################
// Name:         FUNCTIONS
//-###########################################################################
//----------------------------------------------------------------------------
// Name:            Constants.alphaO2
// Source:        Dash & Bassingthwaight 2010
//----------------------------------------------------------------------------
function alphaO2_func(Temp, Wpl) {
    return 0.1333**-1*(1.37-0.0137*(Temp-310.15)+0.00058*(Temp-310.15)**2)*(1e-6*Wpl**-1) // M/kPa
}
//----------------------------------------------------------------------------
// Name:         Constants.alphaCO2
// Source:       Kelman 1967
//----------------------------------------------------------------------------
function alphaCO2_func(Temp, Wpl) {
    return 0.1333**-1*(3.07-0.057*(Temp-310.15)+0.002*(Temp-310.15)**2)*(1e-5*Wpl**-1) // M/kPa
}
//----------------------------------------------------------------------------
// Name:         P50
// Source:       Dash & Bassingthwaight 2010
//----------------------------------------------------------------------------
function P50(pH, PnCO2, DPG, Temp) {
    var P50_pH = -2.84*(pH+Math.log10(0.69)-7.24)+1.18*(pH+Math.log10(0.69)-7.24)**2
    var P50_PnCO2 = 4.82e-2*(PnCO2-5.332)+3.64e-5*(PnCO2-5.332)**2
    var P50_DPG = 1.06e2*(DPG-4.65e-3)-2.62e3*(DPG-4.65e-3)**2
    var P50_Temp = 1.99e-1*(Temp-310.15)+5.78e-3*(Temp-310.15)**2+9.33e-05*(Temp-310.15)**3
    return 3.57+P50_PnCO2+P50_pH+P50_DPG+P50_Temp // kPa
}
//----------------------------------------------------------------------------
// Name:         SnO2
// Source:       Dash & Bassingthwaight 2010
//----------------------------------------------------------------------------
// Equation B.3
function SnO2_1(PnO2, pH, PnCO2, DPG, Temp) {
    /*Calculate O2 SATURATION from PARTIAL PRESSURE*/ // fraction
    return ((PnO2*P50(pH, PnCO2, DPG, Temp)**-1)**(1+n0))/
        (1+((PnO2*P50(pH, PnCO2, DPG, Temp)**-1)**(1+n0)))
}
function SnO2_2_null(Sats, CnO2, P50_SnO2) {
    /*returns 0 */
    return Constants.Wbl*Constants.alphaO2*P50_SnO2*(Sats*(1-Sats)**-1)**((1+n0)**-1) + 
        (4*Constants.HbMol)*Sats - (CnO2*(R*STP_T*STP_P**-1*1e2)**-1)
}
function SnO2_2(CnO2_local, P50_SnO2) {
    /*Calculate O2 SATURATION from CONTENT*/ // fraction
    CnO2_local = Math.max(CnO2_local,0.1) // prevent negative values being fed to acidbase2
    P50_SnO2 = Math.max(P50_SnO2,0.1) // prevent negative values being fed to acidbase2
    return brentq(SnO2_2_null,1e-15,1-1e-15,[CnO2_local, P50_SnO2],{rtol:toleranceoferror_so2})
}
//----------------------------------------------------------------------------
// Name:         Blood O2 content
// Source:       Dash & Bassingthwaight 2010
//----------------------------------------------------------------------------
function CnO2_1(PnO2, pH, PnCO2, DPG, Temp) {
    /*Calculate O2 CONTENT from PARTIAL PRESSURE*/
    return (Constants.Wbl*P50(pH,PnCO2,DPG,Temp)*(SnO2_1(PnO2,pH,PnCO2,DPG,Temp)*(1
    -SnO2_1(PnO2,pH,PnCO2,DPG,Temp))**-1)**((1+n0)**-1)*Constants.alphaO2
    +4*Constants.HbMol*SnO2_1(PnO2,pH,PnCO2,DPG,Temp))*(R*STP_T*STP_P**-1*1e2)
    // ml of O2 per 100ml blood STP
}
//----------------------------------------------------------------------------
// Name:         Blood O2 partial pressure
// Source:       Dash & Bassingthwaight 2010
//----------------------------------------------------------------------------
function PnO2_1(SnO2, P50_SnO2) {
    /*Calculate O2 PARTIAL PRESSURE from SATURATION*/
    return P50_SnO2*(SnO2*(1-SnO2)**-1)**(((1+n0))**-1) // kPa
}
function PnO2_2(CnO2,P50_SnO2) {
    /*Calculate O2 PARTIAL PRESSURE from CONTENT*/
    var SnO2 = SnO2_2(CnO2, P50_SnO2)
    return P50_SnO2*(SnO2*(1-SnO2)**-1)**(((1+n0))**-1) // kPa
}
//----------------------------------------------------------------------------
// Name:         CnCO2
// Source:       Dash & Bassingthwaight 2010
//----------------------------------------------------------------------------
function Kratio(PnCO2, pH, Temp, Wpl) {
    var Hrbc = 10**-(pH+Math.log10(0.69)) // M
    var CO2 = PnCO2*alphaCO2_func(Temp, Wpl) // M
    return (K_prime_2*CO2*(1+K_2prime_2*Hrbc**-1)+(1+Hrbc*K_2prime_5**-1))*
    (K_prime_3*CO2*(1+K_2prime_3*Hrbc**-1)+(1+Hrbc*K_2prime_6**-1))**-1 // unitless
}
function CnCO2_Dissolved(PnCO2) {
    /*Calculate CO2 dissolved in WHOLE BLOOD*/
    return Constants.Wbl*Constants.alphaCO2*PnCO2 // M
}
function CnCO2_Bicarb(pH, PnCO2) {
    /*Calculate CO2 as bicarbonate in WHOLE BLOOD*/
    return ((1-Constants.Hct)*Wpl+Constants.Hct*Wrbc*0.69)*HH_1(PnCO2, pH) // M
}
function CnCO2_HbBound(PnCO2, PnO2, pH, DPG, Temp) {
    /*Calculate Hb-CO2 from PARTIAL PRESSURE*/
    var K_prime_4 = (Constants.alphaO2*PnO2)**n0*Kratio(PnCO2,pH,Temp,Wpl)*(P50(pH, PnCO2, DPG, Temp)*Constants.alphaO2)**-(1+n0)
    var SHbCO2 = ( 
    K_prime_2*Constants.alphaCO2*PnCO2*(1+K_2prime_2*(10**-(pH+Math.log10(0.69)))**-1) + 
    K_prime_3*Constants.alphaCO2*PnCO2*(1+K_2prime_3*(10**-(pH+Math.log10(0.69)))**-1)*K_prime_4*Constants.alphaO2*PnO2
    )*( 
    K_prime_2*Constants.alphaCO2*PnCO2*(1+K_2prime_2*(10**-(pH+Math.log10(0.69)))**-1) + 
    (1+(10**-(pH+Math.log10(0.69)))*K_2prime_5**-1) + 
    K_prime_4*Constants.alphaO2*PnO2*(K_prime_3*Constants.alphaCO2*PnCO2*(1+K_2prime_3*(10**-(pH+Math.log10(0.69)))**-1) + 
    (1+(10**-(pH+Math.log10(0.69)))*K_2prime_6**-1)) 
    )**-1
    return 4*Constants.HbMol*SHbCO2 // M
}
function CnCO2_1(pH, PnCO2, PnO2, DPG, Temp) {
    /*Calculate CO2 CONTENT from PARTIAL PRESSURE*/
    return (CnCO2_HbBound(PnCO2,PnO2,pH, DPG, Temp)+CnCO2_Bicarb(pH,PnCO2)
        +CnCO2_Dissolved(PnCO2))*(R*STP_T*STP_P**-1*1e2) // ml CO2 per 100ml blood STP
}
function PnCO2_null(PnCO2, CnCO2, pH, CnO2, DPG, Temp) {
    /*returns 0*/
    var P50_PnCO2_null = P50(pH, PnCO2, DPG, Temp)
    return CnCO2_1(pH, PnCO2, PnO2_2(CnO2, P50_PnCO2_null), DPG, Temp)-CnCO2 // null
}
function PnCO2_1(CnCO2, pH, CnO2, DPG, Temp) {
    /*Calculate CO2 PARTIAL PRESSURE from CONTENTS*/
    var args = [CnCO2,pH,CnO2, DPG, Temp]
    var PnCO2 = newton(PnCO2_null,AGE['PcCO2'],args,{tol:0.01})
    return PnCO2 // kPa
}
//----------------------------------------------------------------------------
// Name:     Henderson-Hasselbalch Equation
//----------------------------------------------------------------------------
function HH_1(PnCO2, pH) {
    /*Calculate CO2 as bicarbonate in SOLUTION*/
    return (K_1*Constants.alphaCO2*PnCO2)*(10**-pH)**-1 // M
}
//----------------------------------------------------------------------------
// Name:     van Slyke Equation
// Source:   Siggaard-Andersen 1977
//----------------------------------------------------------------------------
function vanSlyke_1(pH, BE, SnO2, Hb) {
    /*returns bicarbonate from PLASMA pH @ 37 deg C and variables.BE*/
    var zeta = 1-(0.0143*Hb*1e-1)
    var beta = 9.5+1.63*Hb*1e-1
    return ((BE*1e3 - 0.2*Hb*1e-1*(1-SnO2))*zeta**-1 - beta*(pH-7.4) + StdBicarb*1e3)*1e-3 // M
}
//----------------------------------------------------------------------------
// Name:     simultaneous solution Henderson-Hasselbalch and van Slyke
//----------------------------------------------------------------------------
function acidbase_1_null(pH, BE, PnCO2, PnO2, DPG, Temp, Hb) {
    /*returns 0*/
    var SnO2 = SnO2_1(PnO2, pH, PnCO2, DPG, Temp)
    var zeta = 1-(0.0143*Hb*1e-1)
    var beta = 9.5+1.63*Hb*1e-1
    return ((BE*1e3 - 0.2*Hb*1e-1*(1-SnO2))*zeta**-1 - beta*(pH-7.4) + StdBicarb*1e3)*1e-3 - HH_1(PnCO2, pH) // null
}
function acidbase_1(BE,PnCO2,PnO2, DPG, Temp, Hb) {
    /*returns PLASMA pH from PARTIAL PRESSURE */
    return brentq(acidbase_1_null,1,14,[BE,PnCO2,PnO2, DPG, Temp, Hb],{rtol:toleranceoferror_ph}) // pH units
}
function acidbase_2_null(pH,BE,CnCO2,CnO2, DPG, Temp, Hb) {
    /*returns 0*/
    var PnCO2 = PnCO2_1(CnCO2,pH,CnO2, DPG, Temp)
    var SnO2 = SnO2_2(CnO2, P50(pH,PnCO2,DPG,Temp))
    var zeta = 1-(0.0143*Hb*1e-1)
    var beta = 9.5+1.63*Hb*1e-1
    return ((BE*1e3 - 0.2*Hb*1e-1*(1-SnO2))*zeta**-1 - beta*(pH-7.4) + StdBicarb*1e3)*1e-3 - HH_1(PnCO2, pH) // null
}
function acidbase_2(BE,CnCO2,CnO2, DPG, Temp, Hb) {
    /*returns PLASMA pH from CONTENT */
    return brentq(acidbase_2_null,1,14,[BE,CnCO2,CnO2, DPG, Temp, Hb],{rtol:toleranceoferror_ph}) // pH units
}
//-###########################################################################
// Name:         COMPARTMENT SPECIFIC FUNCTIONS
//-###########################################################################
//-------------------------------------------------------------------------------
//           Alveolar Gas Equation
//-------------------------------------------------------------------------------
function populatealvgaseqn(variables, constants) {
    var AGE={}
    AGE['PACO2'] = variables.VO2*variables.RQ*STP_P*variables.Temp*STP_T**-1*constants.VA**-1 // Alveolar ventilation equation
    AGE['PcCO2'] = AGE['PACO2'] // assumes complete equilibrium
    AGE['PAO2'] = constants.PIO2 - ((AGE['PACO2']*(1-variables.fio2*(1-variables.RQ)))*variables.RQ**-1)// Alveolar gas Equation
    AGE['PcO2'] = AGE['PAO2'] // assumes complete equilibrium
    AGE['pH'] = acidbase_1(variables.BE,AGE['PcCO2'],AGE['PcO2'], variables.DPG, variables.Temp, variables.Hb)
    AGE['CcCO2'] = CnCO2_1(AGE['pH'], AGE['PcCO2'], AGE['PcO2'], variables.DPG, variables.Temp)
    AGE['CcO2'] = CnO2_1(AGE['PcO2'], AGE['pH'], AGE['PcCO2'], variables.DPG, variables.Temp)
    AGE['CvO2'] = AGE['CcO2'] - 100*(variables.VO2*(variables.CO*(1-variables.pulm_shunt))**-1) 
    AGE['CvCO2'] = AGE['CcCO2'] + 100*(((variables.VO2*variables.RQ))*(variables.CO*(1-variables.pulm_shunt))**-1)
    return AGE
}
//-------------------------------------------------------------------------------
// Name:         Transit Time, initial value problem
// Source:       Wagner and West 1972
//-------------------------------------------------------------------------------
function dxdt(inputs, t, VQ, DmO2_ivp, Vc_ivp, CvO2_local, CvCO2_local, variables) {
    var CcO2_local = inputs[0]
    var CcCO2_local = inputs[1]
    var PACO2_local = 0
    var PAO2_local = variables.fio2*(Constants.Pres-Constants.PH2O)
    if ((CvCO2_local - CcCO2_local) != (CcO2_local - CvO2_local)) {
        variables.RQ = (CvCO2_local-CcCO2_local)*(CcO2_local-CvO2_local)**-1 // ratio
        PACO2_local = VQ**-1*(CcO2_local-CvO2_local)*1e-2*variables.RQ*STP_P*variables.Temp*STP_T**-1 // kPa
        PAO2_local =  variables.fio2*(Constants.Pres-Constants.PH2O)-((PACO2_local*(1-variables.fio2*(1-variables.RQ)))*variables.RQ**-1) // kPa
    }
    else {
        variables.RQ = 0
    }
    CcCO2_local = Math.max(CcCO2_local,0.1) // prevent negative values being fed to acidbase2
    CcO2_local = Math.max(CcO2_local,0.1) // prevent negative values being fed to acidbase2
    organVars.pH_c = acidbase_2(variables.BE, CcCO2_local, CcO2_local, variables.DPG, variables.Temp, variables.Hb) // pH units
    var PcCO2_local = PnCO2_1(CcCO2_local, organVars.pH_c, CcO2_local, variables.DPG, variables.Temp) // kPa
    var P50_dxdt = P50(organVars.pH_c, PcCO2_local, variables.DPG, variables.Temp) // kPa
    var PcO2_local = PnO2_2(CcO2_local, P50_dxdt) // kPa
    var Sats = SnO2_1(PcO2_local, organVars.pH_c, PcCO2_local, variables.DPG, variables.Temp) // fraction
    var K_prime_c = 1.25284e5+3.6917e4*Math.E**(3.8200*Sats) // M**-1.sec**-1
    var rateO2 = K_prime_c*Constants.alphaO2*60*(1-Sats)*4*Constants.HbMol*R*STP_T*STP_P**-1 // ml(O2).ml(bld)**-1.kPa**-1.min**-1
    var DLO2 = (DmO2_ivp**-1 + (rateO2*Vc_ivp*1e3)**-1)**-1 // ml(O2).min**-1.kPa**-1
    var dO2dt = 100*(Vc_ivp*1e3)**-1*DLO2*(PAO2_local-PcO2_local) // ml(O2).100ml(bld)**-1.min**-1
    var DmCO2 = DmO2_ivp*20 // ml(CO2).min**-1.kPa**-1
    var DLCO2 = DmCO2 // assumes infinitely fast rate of reaction of CO2
    var dCO2dt = 100*(Vc_ivp*1e3)**-1*DLCO2*(PACO2_local-PcCO2_local) // ml.CO2.100mlBlood^-1.min^-1
    return [dO2dt, dCO2dt]
}
//-------------------------------------------------------------------------------
// Name:         Transit Time, initial value problem
// Source:       Wagner and West 1972, altered 
//-------------------------------------------------------------------------------
function dxdt_organ(inputs, t, DmO2_ivp, vol_b, CinputO2, CinputCO2, Q, compound, Qd, CdiO2, CdiCO2, variables) {
    var CoutputO2 = inputs[0] // these are the only values that are changed with each iteration
    var CoutputCO2 = inputs[1]
    var solubilitycoefficientO2 = scO2dict[compound]
    var solubilitycoefficientCO2 = scCO2dict[compound]
    var CdoO2 = CdiO2
    var CdoCO2 = CdiCO2
    // beyond first iteration
    if ((CinputCO2 - CoutputCO2) != (CoutputO2 - CinputO2)) {
        CdoO2 = (Qd*CdiO2 - Q*(CoutputO2-CinputO2))/Qd      // FICK within organ
        CoutputO2 = (Q*CinputO2 + Qd*(CdiO2-CdoO2))/Q       // FICK in blood 
        CdoCO2 = (Qd*CdiCO2 - Q*(CoutputCO2-CinputCO2))/Qd  // FICK within organ
        CoutputCO2 = (Q*CinputCO2 + Qd*(CdiCO2-CdoCO2))/Q   // FICK in blood
    }
    var PorganO2 = ((CdoO2*10*1000**-1)/solubilitycoefficientO2) * STP_P 
    var k = STP_P*variables.Temp/STP_T
    var PorganCO2 = ((CdoCO2*10*1000**-1)/solubilitycoefficientCO2) * k 
    // equilibrate haemoglobin
    organVars.pH_c = acidbase_2(variables.BE, CoutputCO2, CoutputO2, variables.DPG, variables.Temp, variables.Hb) // pH units
    var PoutputCO2 = PnCO2_1(CoutputCO2, organVars.pH_c, CoutputO2, variables.DPG, variables.Temp) // kPa
    var P50_dxdt = P50(organVars.pH_c, PoutputCO2, variables.DPG, variables.Temp) // kPa
    var PoutputO2 = PnO2_2(CoutputO2, P50_dxdt) // kPa
    var Sats = SnO2_1(PoutputO2, organVars.pH_c, PoutputCO2, variables.DPG, variables.Temp) // fraction
    // now do O2
    if (DmO2_ivp==0) {
        return [0,0] // no diffusion, no change. 
    }
    var K_prime_c = 1.25284e5+3.6917e4*Math.E**(3.8200*Sats) // M**-1.sec**-1
    var theta = K_prime_c*Constants.alphaO2*60*(1-Sats)*4*Constants.HbMol*R*STP_T*STP_P**-1 // ml(O2).ml(bld)**-1.kPa**-1.min**-1
    var DiffusionO2 = (DmO2_ivp**-1 + (theta*vol_b*1e3)**-1)**-1 // ml(O2).min**-1.kPa**-1
    var dO2dt = 100*(vol_b*1e3)**-1*DiffusionO2*(PorganO2-PoutputO2) // ml(O2).100ml(bld)**-1.min**-1
    // now do CO2
    var DmCO2 = DmO2_ivp*20 // ml(CO2).min**-1.kPa**-1
    if (DmCO2==0) {
        return [0,0] // no diffusion, no change. 
    }
    var DLCO2 = DmCO2 // assumes infinitely fast rate of reaction of CO2
    var dCO2dt = 100*(vol_b*1e3)**-1*DLCO2*(PorganCO2-PoutputCO2) // ml.CO2.100mlBlood^-1.min^-1
    return [dO2dt, dCO2dt]


}
function runorgan(dtype, preorganCnO2, preorganCnCO2, variables, heter_stat=1e-200, ncomp=20) {
    /*
    TODO
    if (dtype=="multicompartment_lung") {
        if (debugging) {
            console.log(dtype, preorganCnO2, preorganCnCO2,heter_stat,ncomp)
        }
        var organgas = "air"
        var Vorganblood = variables.Vc*ncomp**-1 // Blood volumn in each compartment
        var Qorganblood = variables.CO*(1-variables.pulm_shunt)*ncomp**-1 // Blood flow through each compartment
        var organO2inputcontent = variables.fio2*(Constants.Pres-Constants.PH2O) // Content organ input O2 mls_gas/volume
        var organCO2inputcontent = 0 // Content organ input CO2 mls_gas/volume
        var membranediffusion = variables.DmO2
        var organtime = variables.Vc*(variables.CO*(1-variables.pulm_shunt))**-1 // Transit time through each lung compartment. This is assumes to variables.be constant as the volume of blood flowing through each compartment is also constant.
        
        var VQtotal = Constants.VA*(variables.CO*(1-variables.pulm_shunt))**-1 // V/Q ratio of the lung as a whole
        var mu = Math.log(VQtotal)-0.5*(heter_stat**2) // The mean of the normal curve that underlies the log-normal curve. This mean is calculated to give the desired VQtotal, and heterstat. (Barring numerical inaccuracies).
        var sigma = heter_stat // note that changing heterstat_changes both mu AND sigma.
        var cdf_boundaries = np.linspace(0,1-1e-6,ncomp) // functionining compartment boundaries. Starting at 0 and running to 0.999999. I.e. the top 1e-6th of the distribution is ignored.
        var x_boundaries = np.exp(2**0.5*sigma*special.erfinv(2*(cdf_boundaries-0.5))+mu) // Calculate the V/Q (i.e. x) values that correspond to the required cdf boundaries required.
        var x_midpoints = 0.5*(x_boundaries.slice(1)+x_boundaries.slice(0,-1)) // Calculating half way points between each of the x boundaries for the trapezoid rule.
        var organflow = Qorganblood*x_midpoints // This is the gas flow to each of the corresponding compartments. NB given this set up, the blood flow is constant between compartments., the gas flow varies.

        // Constants.VA calculated in a few different ways
        if (debugging) {
            console.log('user specified Constants.VA: ', Constants.VA)
            console.log('Constants.VA as per V/Q dist sum: ', sum(organflow))

        }
        // Call transit time for each of the compartments seperately. As the blood flow through each compartment is constant, the resulting output content is just the mean of all the compartments.
        var wholeorganCnO2 = 0
        var wholeorganCnCO2 = 0
        for (var Vcomp of organflow) {
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            postorganCnO2,postorganCnCO2 = integrate.odeint(dxdt_organ,
                [preorganCnO2,preorganCnCO2],[0,organtime],
                    (membranediffusion, Vorganblood, preorganCnO2, preorganCnCO2, Qorganblood,
                        organgas, Vcomp, organO2inputcontent, organCO2inputcontent, variables),
                    rtol=toleranceoferror_organ, mxstep=1000000)[1]
            // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
            wholeorganCnO2 += postorganCnO2
            wholeorganCnCO2 += postorganCnCO2
        }
        wholeorganCnO2 = wholeorganCnO2*(ncomp-1)**-1 // ncomp-1 as there is one less fence than fence post.
        wholeorganCnCO2 = wholeorganCnCO2*(ncomp-1)**-1
        var CdoO2 = (Constants.VA*organO2inputcontent - variables.CO*(1-variables.pulm_shunt)*(wholeorganCnO2-preorganCnO2))/Constants.VA    // FICK within organ
        var CdoCO2 = (Constants.VA*organCO2inputcontent - variables.CO*(1-variables.pulm_shunt)*(wholeorganCnCO2-preorganCnCO2))/Constants.VA
        var PorganO2 = ((CdoO2*10*1000**-1)/scO2dict[organgas]) * STP_P*variables.Temp/STP_T 
        var PorganCO2 = ((CdoCO2*10*1000**-1)/scCO2dict[organgas]) * STP_P*variables.Temp/STP_T 
        return wholeorganCnO2, wholeorganCnCO2, PorganO2, PorganCO2

    }*/
    if (dtype=="lung") {
        // organ settings for organ==LUNG
        var organgas = "air"
        var organflow = Constants.VA // organ flow rate l/min
        var Vorganblood = variables.Vc*1
        var Qorganblood = variables.CO*(1-variables.pulm_shunt)
        var organO2inputcontent = variables.fio2*(Constants.Pres-Constants.PH2O) // Content organ input O2 mls_gas/volume
        var organCO2inputcontent = 0 // Content organ input CO2 mls_gas/volume
        var membranediffusion = variables.DmO2
        var organtime = Vorganblood/Qorganblood // in minutes
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
        //var [postorganCnO2,postorganCnCO2] = [20,45]
        /*var [postorganCnO2,postorganCnCO2] = integrate.odeint(dxdt_organ,
                [preorganCnO2,preorganCnCO2],[0,organtime],
                (membranediffusion, Vorganblood, preorganCnO2, preorganCnCO2, Qorganblood,
                organgas, organflow, organO2inputcontent, organCO2inputcontent, variables),
                rtol=toleranceoferror_organ, mxstep=1000000)[1]*/
        var x = solve_ivp(dxdt_organ,[preorganCnO2,preorganCnCO2],[0,organtime],
            [membranediffusion, Vorganblood, preorganCnO2, preorganCnCO2, Qorganblood, organgas, organflow, organO2inputcontent, organCO2inputcontent, variables],
            toleranceoferror_organ)
        // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
        var postorganCnO2 = x[0]
        var postorganCnCO2 = x[1]
        // and get the organ values too {
        var CdoO2 = (organflow*organO2inputcontent - Qorganblood*(postorganCnO2-preorganCnO2))/organflow         // FICK within organ
        var CdoCO2 = (organflow*organCO2inputcontent - Qorganblood*(postorganCnCO2-preorganCnCO2))/organflow
        var PorganO2 = ((CdoO2*10*1000**-1)/scO2dict[organgas]) * STP_P*variables.Temp/STP_T 
        var PorganCO2 = ((CdoCO2*10*1000**-1)/scCO2dict[organgas]) * STP_P*variables.Temp/STP_T 
        return [postorganCnO2, postorganCnCO2, PorganO2, PorganCO2]


    }
}
//-------------------------------------------------------------------------------
//           mass balance
//-------------------------------------------------------------------------------
/*function lung_null(content, variables) {
    Constants.VQ = Constants.VA*(variables.CO*(1-variables.pulm_shunt))**-1;
    [content['CcO2'],content['CcCO2']] = 
    integrate.odeint(dxdt,[content['CvO2'],content['CvCO2']],[0,variables.Vc*(variables.CO*(1-variables.pulm_shunt))**-1],
    (Constants.VQ,variables.DmO2,variables.Vc,content['CvO2'],content['CvCO2'], variables),rtol=toleranceoferror_lung)[1]
    var out = [content['CcO2'] - content['CvO2'] - 100*((organVars.trueVO2)*(variables.CO*(1-variables.pulm_shunt))**-1)]
    out.push(content['CvCO2'] - content['CcCO2'] - 100*((variables.RQ*organVars.trueVO2)*(variables.CO*(1-variables.pulm_shunt))**-1))
    return out
}*/
//-------------------------------------------------------------------------------
//         compartment contents
//-------------------------------------------------------------------------------
function updatebloodgascontents(variables) {
    //-------------------------------------------------------------------------------
    // Pulmonary capillaries & Veins
    //-------------------------------------------------------------------------------
    //TEMPORARY UNTIL INTEGRATION WORKS
    
    organVars['CvCO2']=24.128544212222064
    organVars['CcO2']=20.988826785103143
    organVars['CcCO2']=20.988826785103143
    organVars['CaCO2']=21.051621133645522
    organVars['CaO2']=20.910333849501093
    organVars['CtO2']=16.861750853549676
    organVars['CtCO2']=24.290487530406654

    organVars['CvO2'] = 17.06418000500071
    organVars['CvCO2'] = 24.128544212222064
    return;
    organVars['CvO2'] = 16.7136288222095
    organVars['CvCO2'] = 47.68584337952363
    organVars['CcO2'] = 20.638275604163468
    organVars['CcCO2'] = 44.54612595409117

    organVars['CvO2'] = AGE['CvO2']
    organVars['CvCO2'] = AGE['CvCO2']
    //optimize.fsolve(lung_null, (organVars, variables), xtol=0.001) does nothing??
    //-------------------------------------------------------------------------------
    // Arteries
    //-------------------------------------------------------------------------------
    organVars['CaCO2'] = variables.pulm_shunt*organVars['CvCO2'] + (1-variables.pulm_shunt)*organVars['CcCO2'] // mlO2/100mlblood
    organVars['CaO2'] = variables.pulm_shunt*organVars['CvO2'] + (1-variables.pulm_shunt)*organVars['CcO2'] // mlO2/100mlblood
    //-------------------------------------------------------------------------------
    // Tissues
    //-------------------------------------------------------------------------------
    var QO2 = variables.CO*(1-variables.tissue_shunt)*organVars['CaO2']*100**-1 // lO2/min
    organVars['CtO2'] = 100*(QO2-variables.VO2)/((1-variables.tissue_shunt)*variables.CO) // mlO2/100mlblood
    organVars['CtCO2'] = organVars['CaCO2'] + 100*variables.VO2*variables.RQ*(variables.CO*(1-variables.tissue_shunt))**-1 // ml.CO2/100ml.Blood
}
//-------------------------------------------------------------------------------
//           compartment partial pressures, acid base and O2 saturation
//-------------------------------------------------------------------------------
function updatepartialpressures(variables, compartments = ['c','a','t','v']) {
    if (compartments.includes('c')) {
        updatepartialpressures_c(variables)
    }
    if (compartments.includes('a')) {
        updatepartialpressures_a(variables)
    }
    if (compartments.includes('t')) {
        updatepartialpressures_t(variables)
    }
    if (compartments.includes('v')) {
        updatepartialpressures_v(variables)
    }
}
function updatepartialpressures_c(variables) {
    if (organVars.CcO2 < 0) {
        organVars.CcO2 = 0.1
    }
    if (organVars.CcCO2 < 0) {
        organVars.CcCO2 = 0.1 
    }
    organVars.pH_c = acidbase_2(variables.BE, organVars.CcCO2, organVars.CcO2, variables.DPG, variables.Temp, variables.Hb)
    organVars.PcCO2 = PnCO2_1(organVars.CcCO2, organVars.pH_c, organVars.CcO2, variables.DPG, variables.Temp)
    organVars.P50_c = P50(organVars.pH_c, organVars.PcCO2, variables.DPG, variables.Temp)
    organVars.ScO2 = SnO2_2(organVars.CcO2, organVars.P50_c)
    organVars.PcO2 = PnO2_1(organVars.ScO2, organVars.P50_c)
    organVars.HCO3_c = vanSlyke_1(organVars.pH_c, variables.BE, organVars.ScO2, variables.Hb)
}
function updatepartialpressures_a(variables) {
    if (organVars.CaO2 < 0) {
        organVars.CaO2 = 0.1
    }
    if (organVars.CaCO2 < 0) {
        organVars.CaCO2 = 0.1 
    }
    organVars.pH_a = acidbase_2(variables.BE, organVars.CaCO2, organVars.CaO2, variables.DPG, variables.Temp, variables.Hb)
    organVars.PaCO2 = PnCO2_1(organVars.CaCO2, organVars.pH_a, organVars.CaO2, variables.DPG, variables.Temp)
    organVars.P50_a = P50(organVars.pH_a, organVars.PaCO2, variables.DPG, variables.Temp)
    organVars.SaO2 = SnO2_2(organVars.CaO2, organVars.P50_a)
    organVars.PaO2 = PnO2_1(organVars.SaO2, organVars.P50_a)
    organVars.HCO3_a = vanSlyke_1(organVars.pH_a, variables.BE, organVars.SaO2, variables.Hb)
}
function updatepartialpressures_t(variables) {
    if (organVars.CtO2 < 0) {
        organVars.CtO2 = 0.1
    }
    if (organVars.CtCO2 < 0) {
        organVars.CtCO2 = 0.1 
    }
    organVars.pH_t = acidbase_2(variables.BE, organVars.CtCO2, organVars.CtO2, variables.DPG, variables.Temp, variables.Hb)
    organVars.PtCO2 = PnCO2_1(organVars.CtCO2, organVars.pH_t, organVars.CtO2, variables.DPG, variables.Temp)
    organVars.P50_t = P50(organVars.pH_t, organVars.PtCO2, variables.DPG, variables.Temp)
    organVars.StO2 = SnO2_2(organVars.CtO2, organVars.P50_t)
    organVars.PtO2 = PnO2_1(organVars.StO2, organVars.P50_t)
    organVars.HCO3_t = vanSlyke_1(organVars.pH_t, variables.BE, organVars.StO2, variables.Hb)
}
function updatepartialpressures_v(variables) {
    if (organVars.CvO2 < 0) {
        organVars.CvO2 = 0.1
    }
    if (organVars.CvCO2 < 0) {
        organVars.CvCO2 = 0.1 
    }
    organVars.pH_v = acidbase_2(variables.BE, organVars.CvCO2, organVars.CvO2, variables.DPG, variables.Temp, variables.Hb)
    organVars.PvCO2 = PnCO2_1(organVars.CvCO2, organVars.pH_v, organVars.CvO2, variables.DPG, variables.Temp)
    organVars.P50_v = P50(organVars.pH_v, organVars.PvCO2, variables.DPG, variables.Temp)
    organVars.SvO2 = SnO2_2(organVars.CvO2, organVars.P50_v)
    organVars.PvO2 = PnO2_1(organVars.SvO2, organVars.P50_v)
    organVars.HCO3_v = vanSlyke_1(organVars.pH_v, variables.BE, organVars.SvO2, variables.Hb)
}
//-------------------------------------------------------------------------------
// Name:         Timecheck
//-------------------------------------------------------------------------------
function fail(message='') {
    console.log(0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",0,"||",message)
}

function check_completion() {
    var diff = 0
    for (var key in organVars) {
        diff += Math.abs(organVars[key] - oldvalues[key])

        oldvalues[key] = organVars[key]
    }
    return diff
}

function printglobals() {
    console.log("===================")
    for (var key in organVars) {
        console.log(`${key}, ${organVars[key]}`)
    }
    console.log("===================")

}
//-------------------------------------------------------------------------------
// Name:         Run model
//-------------------------------------------------------------------------------
function circulate_once(variables, iterationnumber=0) {
    if (verbose) {
        printglobals()
    }
    // ====== alveoli and pulmonary capillaries =======
    //organVars.CcO2,organVars.CcCO2 = integrate.odeint(dxdt,[organVars.CvO2,organVars.CvCO2],[0,variables.Vc*(variables.CO*(1-variables.pulm_shunt))**-1],(Constants.VQ,variables.DmO2,variables.Vc,organVars.CvO2,organVars.CvCO2),rtol=toleranceoferror_lung, mxstep=1000000)[1]
    if (variables.hetindex==0) {
        [organVars.CcO2, organVars.CcCO2, organVars.PAO2, organVars.PACO2] = runorgan('lung', organVars.CvO2, organVars.CvCO2, variables)
    }
    else {
        [organVars.CcO2, organVars.CcCO2, organVars.PAO2, organVars.PACO2] = runorgan('multicompartment_lung', organVars.CvO2, organVars.CvCO2, variables, variables.hetindex, num_lung_compartments)
    }
    updatepartialpressures_c(variables)
    if (mbc) {
        console.log("mass balance check[c]: VO2:", variables.CO*(1-variables.pulm_shunt)*(organVars.CcO2-organVars.CvO2)*10,  "VCO2:", variables.CO*(1-variables.pulm_shunt)*(organVars.CvCO2-organVars.CcCO2)*10)
    }
    // ======== arteries ========
    organVars.CaO2 = variables.pulm_shunt*organVars.CvO2 + (1-variables.pulm_shunt)*organVars.CcO2
    organVars.CaCO2 = variables.pulm_shunt*organVars.CvCO2 + (1-variables.pulm_shunt)*organVars.CcCO2 // mlO2/100mlblood
    updatepartialpressures_a(variables)
    if (mbc) {
        console.log("mass balance check[a]: VO2:", variables.CO*(organVars.CaO2-organVars.CvO2)*10,  "VCO2:", variables.CO*(organVars.CvCO2-organVars.CaCO2)*10)
    }
    // ========= ECMO ==========
    organVars.ecmodelivery=0
    if (variables.ecmosites.includes("aorta")) {
        var CecmoO2 = CnO2_1(100, organVars.pH_a, organVars.PaCO2, variables.DPG, variables.Temp)
        organVars.CaO2 = (variables.Qecmo*CecmoO2+(variables.CO-variables.Qecmo)*organVars.CaO2)/variables.CO
        organVars.ecmodelivery += (CecmoO2 - organVars.CvO2) * variables.Qecmo * 10 // convert mls/dl to mls/l
        updatepartialpressures_v(variables)
    }
    if (mbc) {
        console.log("mass balance check[ae]: VO2:", variables.CO*(organVars.CaO2-organVars.CvO2)*10,  "VCO2:", variables.CO*(organVars.CvCO2-organVars.CaCO2)*10)
    }
    // ========= tissues ==========
    var Qtissue = variables.CO*(1-variables.tissue_shunt)
    organVars.CtO2 = (Qtissue*organVars.CaO2*10 - organVars.trueVO2*1000)/ (Qtissue*10)
    organVars.CtCO2 = (Qtissue*organVars.CaCO2*10 + organVars.trueVO2*variables.RQ*1000)/ (Qtissue*10)
    updatepartialpressures_t(variables)
    if (mbc) {
        console.log("mass balance check[t]: VO2:", Qtissue*(organVars.CaO2-organVars.CtO2)*10,  "VCO2:", Qtissue*(organVars.CtCO2-organVars.CaCO2)*10)
    }
    // ========= veins ==========
    organVars.CvO2 = (organVars.CtO2*Qtissue + organVars.CaO2*variables.CO*variables.tissue_shunt)/variables.CO
    organVars.CvCO2 = (organVars.CtCO2*Qtissue + organVars.CaCO2*variables.CO*variables.tissue_shunt)/variables.CO
    updatepartialpressures_v(variables)
    if (mbc) {
        console.log("mass balance check[v]: VO2:", variables.CO*(organVars.CaO2-organVars.CvO2)*10,  "VCO2:", variables.CO*(organVars.CvCO2-organVars.CaCO2)*10)
    }
    // ========= set variables.VO2 ==========
    var criticalOER = 0.94 // unrealistic maximum
    var criticalDO2 = (variables.CO*organVars.CaO2*10)*criticalOER/1000 // mlsO2/min
    if (criticalDO2 < variables.VO2) {
        //then set organVars.trueVO2 = criticalDO2, but prevent oscillation {
        organVars.trueVO2 = organVars.trueVO2 - organVars.trueVO2-criticalDO2/(iterationnumber/VO2correctionspeed+1) // only go a hundredth of the way to avoid oscillation
        //console.log "variables.CO %s organVars.CaO2 %s criticalDO2 %s < variables.VO2 %s so correcting downwards to %s"%(variables.CO, organVars.CaO2, criticalDO2, variables.VO2, organVars.trueVO2)
    }
    else if (organVars.trueVO2<variables.VO2) {
        //then it needs to come back up
        organVars.trueVO2 = variables.VO2
    }
    // ========= ECMO ==========
    if (variables.ecmosites.includes("venacava")) {
        CecmoO2 = CnO2_1(100, organVars.pH_v, organVars.PvCO2, variables.DPG, variables.Temp)
        organVars.CvO2 = (variables.Qecmo*CecmoO2+(variables.CO-variables.Qecmo)*organVars.CvO2)/variables.CO
        organVars.ecmodelivery += (CecmoO2 - organVars.CvO2) * variables.Qecmo * 10 // convert mls/dl to mls/l
        updatepartialpressures_v(variables)
    }
    if (mbc) {
        console.log("mass balance check[ve]: VO2:", variables.CO*(organVars.CaO2-organVars.CvO2)*10,  "VCO2:", variables.CO*(organVars.CvCO2-organVars.CaCO2)*10)


    }
}
//========================
//========================
//========================

var organVars = {
    'PAO2' : 1,
    'PcO2' : 1,
    'PaO2' : 1,
    'PtO2' : 1,
    'PvO2' : 1,
    'CcO2' : 1,
    'CaO2' : 1,
    'CtO2' : 1,
    'CvO2' : 1,
    'ScO2' : 1,
    'SaO2' : 1,
    'StO2' : 1,
    'SvO2' : 1,
    'PACO2' : 1,
    'PcCO2' : 1,
    'PaCO2' : 1,
    'PtCO2' : 1,
    'PvCO2' : 1,
    'CcCO2' : 1,
    'CaCO2' : 1,
    'CtCO2' : 1,
    'CvCO2' : 1,
    'pH_c' : 1,
    'pH_a' : 1,
    'pH_t' : 1,
    'pH_v' : 1,
    'HCO3_c' : 1,
    'HCO3_a' : 1,
    'HCO3_t' : 1,
    'HCO3_v' : 1,
    'ecmodelivery' : 0,
    'trueVO2' : 1,
    'P50_c' : 1,
    'P50_a' : 1,
    'P50_t' : 1,
    'P50_v' : 1,
}

var oldvalues= {}
var AGE = {}

function calculate(data) {
    var variables = getinputs(data)
    calculatedconstants(variables)
    organVars['trueVO2'] = Constants.trueVO2
    AGE = populatealvgaseqn(variables, Constants)
    updatebloodgascontents(variables)
    updatepartialpressures(variables)

    for (var i = 0; i < variables.maxruns; i++) {
        circulate_once(variables, i)
        var globaldiff = check_completion()
        if (globaldiff < globaldifftolerance) {
            break
        }
    }
    return {
        'PatmosO2':(variables.fio2*Constants.Pres).toFixed(2),
        'Constants.PIO2':(variables.fio2*(Constants.Pres - Constants.PH2O)).toFixed(2),
        'PAO2':organVars.PAO2,
        'PcO2':organVars.PcO2,
        'PtO2':organVars.PtO2,
        'PvO2':organVars.PvO2,
        'PaO2':organVars.PaO2.toFixed(1),
        'PaCO2':organVars.PaCO2.toFixed(1),
        'pH':organVars.pH_a.toFixed(2),
        'H+':10**9*10**-organVars.pH_a.toFixed(2),
        'HCO3':(organVars.HCO3_a*1000).toFixed(1),
        'SaO2':(organVars.SaO2*100).toFixed(1),
    }
}
// ------  ------  ------  ------  ------  ------  ------  ------ 