import{$ as e,A as t,C as n,D as r,E as o,F as i,G as s,H as a,I as l,J as d,K as c,L as u,M as g,N as f,Q as p,R as h,S as y,T as v,V as m,W as b,X as x,Y as w,Z as k,_ as $,a as S,b as C,c as E,d as q,f as M,g as F,h as L,i as D,j as T,k as z,l as A,m as O,n as I,o as P,p as K,q as R,r as B,s as G,t as U,u as H,v as V,w as j,x as N,y as W,z as Q}from"./c11cdaa8f-CprPpd-o.js";var _=e=>null!=e;var X=e=>"function"!=typeof e||e.length?e:e(),Z=e=>Array.isArray(e)?e:e?[e]:[];var Y=h;var J,ee=function(e){const[t,n]=N(),r=e?.throw?(e,t)=>{throw n(e instanceof Error?e:new Error(t)),e}:(e,t)=>{n(e instanceof Error?e:new Error(t))},o=e?.api?Array.isArray(e.api)?e.api:[e.api]:[globalThis.localStorage].filter(Boolean),i=e?.prefix?`${e.prefix}.`:"",s=new Map,a=new Proxy({},{get(t,n){let a=s.get(n);a||(a=N(void 0,{equals:!1}),s.set(n,a)),a[0]();const l=o.reduce((e,t)=>{if(null!==e||!t)return e;try{return t.getItem(`${i}${n}`)}catch(o){return r(o,`Error reading ${i}${n} from ${t.name}`),null}},null);return null!==l&&e?.deserializer?e.deserializer(l,n,e.options):l}});return!1!==e?.sync&&Q(()=>{const e=e=>{let t=!1;o.forEach(n=>{try{n!==e.storageArea&&e.key&&e.newValue!==n.getItem(e.key)&&(e.newValue?n.setItem(e.key,e.newValue):n.removeItem(e.key),t=!0)}catch(o){r(o,`Error synching api ${n.name} from storage event (${e.key}=${e.newValue})`)}}),t&&e.key&&s.get(e.key)?.[1]()};"addEventListener"in globalThis?(globalThis.addEventListener("storage",e),h(()=>globalThis.removeEventListener("storage",e))):(o.forEach(t=>t.addEventListener?.("storage",e)),h(()=>o.forEach(t=>t.removeEventListener?.("storage",e))))}),[a,(t,n,a)=>{const l=e?.serializer?e.serializer(n,t,a??e.options):n,d=`${i}${t}`;o.forEach(e=>{try{e.getItem(d)!==l&&e.setItem(d,l)}catch(n){r(n,`Error setting ${i}${t} to ${l} in ${e.name}`)}});const c=s.get(t);c&&c[1]()},{clear:()=>o.forEach(e=>{try{e.clear()}catch(t){r(t,`Error clearing ${e.name}`)}}),error:t,remove:e=>o.forEach(t=>{try{t.removeItem(`${i}${e}`)}catch(n){r(n,`Error removing ${i}${e} from ${t.name}`)}}),toJSON:()=>{const t={},n=(n,r)=>{if(!t.hasOwnProperty(n)){const o=r&&e?.deserializer?e.deserializer(r,n,e.options):r;o&&(t[n]=o)}};return o.forEach(e=>{if("function"==typeof e.getAll){let t;try{t=e.getAll()}catch(o){r(o,`Error getting all values from in ${e.name}`)}for(const e of t)n(e,t[e])}else{let i,s=0;try{for(;i=e.key(s++);)t.hasOwnProperty(i)||n(i,e.getItem(i))}catch(o){r(o,`Error getting all values from ${e.name}`)}}}),t}}]},te=e=>{if(!e)return"";let t="";for(const n in e){if(!e.hasOwnProperty(n))continue;const r=e[n];t+=r instanceof Date?`; ${n}=${r.toUTCString()}`:"boolean"==typeof r?`; ${n}`:`; ${n}=${r}`}return t},ne=("function"==typeof(J={_cookies:[globalThis.document,"cookie"],getItem:e=>ne._cookies[0][ne._cookies[1]].match("(^|;)\\s*"+e+"\\s*=\\s*([^;]+)")?.pop()??null,setItem:(e,t,n)=>{const r=ne.getItem(e);ne._cookies[0][ne._cookies[1]]=`${e}=${t}${te(n)}`;const o=Object.assign(new Event("storage"),{key:e,oldValue:r,newValue:t,url:globalThis.document.URL,storageArea:ne});window.dispatchEvent(o)},removeItem:e=>{ne._cookies[0][ne._cookies[1]]=`${e}=deleted${te({expires:new Date(0)})}`},key:e=>{let t=null,n=0;return ne._cookies[0][ne._cookies[1]].replace(/(?:^|;)\s*(.+?)\s*=\s*[^;]+/g,(r,o)=>(!t&&o&&n++===e&&(t=o),"")),t},get length(){let e=0;return ne._cookies[0][ne._cookies[1]].replace(/(?:^|;)\s*.+?\s*=\s*[^;]+/g,t=>(e+=t?1:0,"")),e}}).clear||(J.clear=()=>{let e;for(;e=J.key(0);)J.removeItem(e)}),J),re=796,oe="bottom",ie="system",se=Object.keys(b)[0],ae=Object.keys(l)[0],le=F({client:void 0,onlineManager:void 0,queryFlavor:"",version:"",shadowDOMTarget:void 0});function de(){return p(le)}var ce=F(void 0),ue=e=>{const[t,r]=N(null),o=()=>{const e=t();null!=e&&(e.close(),r(null))},i=(o,i)=>{if(null!=t())return;const s=window.open("","TSQD-Devtools-Panel",`width=${o},height=${i},popup`);if(!s)throw new Error("Failed to open popup. Please allow popups for this site to view the devtools in picture-in-picture mode.");s.document.head.innerHTML="",s.document.body.innerHTML="",M(s.document),s.document.title="TanStack Query Devtools",s.document.body.style.margin="0",s.addEventListener("pagehide",()=>{e.setLocalStore("pip_open","false"),r(null)}),[...(de().shadowDOMTarget||document).styleSheets].forEach(e=>{try{const t=[...e.cssRules].map(e=>e.cssText).join(""),n=document.createElement("style"),r=e.ownerNode;let o="";r&&"id"in r&&(o=r.id),o&&n.setAttribute("id",o),n.textContent=t,s.document.head.appendChild(n)}catch(t){const n=document.createElement("link");if(null==e.href)return;n.rel="stylesheet",n.type=e.type,n.media=e.media.toString(),n.href=e.href,s.document.head.appendChild(n)}}),n(["focusin","focusout","pointermove","keydown","pointerdown","pointerup","click","mousedown","input"],s.document),e.setLocalStore("pip_open","true"),r(s)};$(()=>{"true"!==(e.localStore.pip_open??"false")||e.disabled||i(Number(window.innerWidth),Number(e.localStore.height||500))}),$(()=>{const e=(de().shadowDOMTarget||document).querySelector("#_goober"),n=t();if(e&&n){const t=new MutationObserver(()=>{const t=(de().shadowDOMTarget||n.document).querySelector("#_goober");t&&(t.textContent=e.textContent)});t.observe(e,{childList:!0,subtree:!0,characterDataOldValue:!0}),h(()=>{t.disconnect()})}});const s=V(()=>({pipWindow:t(),requestPipWindow:i,closePipWindow:o,disabled:e.disabled??!1}));return O(ce.Provider,{value:s,get children(){return e.children}})},ge=()=>V(()=>{const e=p(ce);if(!e)throw new Error("usePiPWindow must be used within a PiPProvider");return e()}),fe=F(()=>"dark");function pe(){return p(fe)}var he={"\xc0":"A","\xc1":"A","\xc2":"A","\xc3":"A","\xc4":"A","\xc5":"A","\u1ea4":"A","\u1eae":"A","\u1eb2":"A","\u1eb4":"A","\u1eb6":"A","\xc6":"AE","\u1ea6":"A","\u1eb0":"A","\u0202":"A","\xc7":"C","\u1e08":"C","\xc8":"E","\xc9":"E","\xca":"E","\xcb":"E","\u1ebe":"E","\u1e16":"E","\u1ec0":"E","\u1e14":"E","\u1e1c":"E","\u0206":"E","\xcc":"I","\xcd":"I","\xce":"I","\xcf":"I","\u1e2e":"I","\u020a":"I","\xd0":"D","\xd1":"N","\xd2":"O","\xd3":"O","\xd4":"O","\xd5":"O","\xd6":"O","\xd8":"O","\u1ed0":"O","\u1e4c":"O","\u1e52":"O","\u020e":"O","\xd9":"U","\xda":"U","\xdb":"U","\xdc":"U","\xdd":"Y","\xe0":"a","\xe1":"a","\xe2":"a","\xe3":"a","\xe4":"a","\xe5":"a","\u1ea5":"a","\u1eaf":"a","\u1eb3":"a","\u1eb5":"a","\u1eb7":"a","\xe6":"ae","\u1ea7":"a","\u1eb1":"a","\u0203":"a","\xe7":"c","\u1e09":"c","\xe8":"e","\xe9":"e","\xea":"e","\xeb":"e","\u1ebf":"e","\u1e17":"e","\u1ec1":"e","\u1e15":"e","\u1e1d":"e","\u0207":"e","\xec":"i","\xed":"i","\xee":"i","\xef":"i","\u1e2f":"i","\u020b":"i","\xf0":"d","\xf1":"n","\xf2":"o","\xf3":"o","\xf4":"o","\xf5":"o","\xf6":"o","\xf8":"o","\u1ed1":"o","\u1e4d":"o","\u1e53":"o","\u020f":"o","\xf9":"u","\xfa":"u","\xfb":"u","\xfc":"u","\xfd":"y","\xff":"y","\u0100":"A","\u0101":"a","\u0102":"A","\u0103":"a","\u0104":"A","\u0105":"a","\u0106":"C","\u0107":"c","\u0108":"C","\u0109":"c","\u010a":"C","\u010b":"c","\u010c":"C","\u010d":"c","C\u0306":"C","c\u0306":"c","\u010e":"D","\u010f":"d","\u0110":"D","\u0111":"d","\u0112":"E","\u0113":"e","\u0114":"E","\u0115":"e","\u0116":"E","\u0117":"e","\u0118":"E","\u0119":"e","\u011a":"E","\u011b":"e","\u011c":"G","\u01f4":"G","\u011d":"g","\u01f5":"g","\u011e":"G","\u011f":"g","\u0120":"G","\u0121":"g","\u0122":"G","\u0123":"g","\u0124":"H","\u0125":"h","\u0126":"H","\u0127":"h","\u1e2a":"H","\u1e2b":"h","\u0128":"I","\u0129":"i","\u012a":"I","\u012b":"i","\u012c":"I","\u012d":"i","\u012e":"I","\u012f":"i","\u0130":"I","\u0131":"i","\u0132":"IJ","\u0133":"ij","\u0134":"J","\u0135":"j","\u0136":"K","\u0137":"k","\u1e30":"K","\u1e31":"k","K\u0306":"K","k\u0306":"k","\u0139":"L","\u013a":"l","\u013b":"L","\u013c":"l","\u013d":"L","\u013e":"l","\u013f":"L","\u0140":"l","\u0141":"l","\u0142":"l","\u1e3e":"M","\u1e3f":"m","M\u0306":"M","m\u0306":"m","\u0143":"N","\u0144":"n","\u0145":"N","\u0146":"n","\u0147":"N","\u0148":"n","\u0149":"n","N\u0306":"N","n\u0306":"n","\u014c":"O","\u014d":"o","\u014e":"O","\u014f":"o","\u0150":"O","\u0151":"o","\u0152":"OE","\u0153":"oe","P\u0306":"P","p\u0306":"p","\u0154":"R","\u0155":"r","\u0156":"R","\u0157":"r","\u0158":"R","\u0159":"r","R\u0306":"R","r\u0306":"r","\u0212":"R","\u0213":"r","\u015a":"S","\u015b":"s","\u015c":"S","\u015d":"s","\u015e":"S","\u0218":"S","\u0219":"s","\u015f":"s","\u0160":"S","\u0161":"s","\u0162":"T","\u0163":"t","\u021b":"t","\u021a":"T","\u0164":"T","\u0165":"t","\u0166":"T","\u0167":"t","T\u0306":"T","t\u0306":"t","\u0168":"U","\u0169":"u","\u016a":"U","\u016b":"u","\u016c":"U","\u016d":"u","\u016e":"U","\u016f":"u","\u0170":"U","\u0171":"u","\u0172":"U","\u0173":"u","\u0216":"U","\u0217":"u","V\u0306":"V","v\u0306":"v","\u0174":"W","\u0175":"w","\u1e82":"W","\u1e83":"w","X\u0306":"X","x\u0306":"x","\u0176":"Y","\u0177":"y","\u0178":"Y","Y\u0306":"Y","y\u0306":"y","\u0179":"Z","\u017a":"z","\u017b":"Z","\u017c":"z","\u017d":"Z","\u017e":"z","\u017f":"s","\u0192":"f","\u01a0":"O","\u01a1":"o","\u01af":"U","\u01b0":"u","\u01cd":"A","\u01ce":"a","\u01cf":"I","\u01d0":"i","\u01d1":"O","\u01d2":"o","\u01d3":"U","\u01d4":"u","\u01d5":"U","\u01d6":"u","\u01d7":"U","\u01d8":"u","\u01d9":"U","\u01da":"u","\u01db":"U","\u01dc":"u","\u1ee8":"U","\u1ee9":"u","\u1e78":"U","\u1e79":"u","\u01fa":"A","\u01fb":"a","\u01fc":"AE","\u01fd":"ae","\u01fe":"O","\u01ff":"o","\xde":"TH","\xfe":"th","\u1e54":"P","\u1e55":"p","\u1e64":"S","\u1e65":"s","X\u0301":"X","x\u0301":"x","\u0403":"\u0413","\u0453":"\u0433","\u040c":"\u041a","\u045c":"\u043a","A\u030b":"A","a\u030b":"a","E\u030b":"E","e\u030b":"e","I\u030b":"I","i\u030b":"i","\u01f8":"N","\u01f9":"n","\u1ed2":"O","\u1ed3":"o","\u1e50":"O","\u1e51":"o","\u1eea":"U","\u1eeb":"u","\u1e80":"W","\u1e81":"w","\u1ef2":"Y","\u1ef3":"y","\u0200":"A","\u0201":"a","\u0204":"E","\u0205":"e","\u0208":"I","\u0209":"i","\u020c":"O","\u020d":"o","\u0210":"R","\u0211":"r","\u0214":"U","\u0215":"u","B\u030c":"B","b\u030c":"b","\u010c\u0323":"C","\u010d\u0323":"c","\xca\u030c":"E","\xea\u030c":"e","F\u030c":"F","f\u030c":"f","\u01e6":"G","\u01e7":"g","\u021e":"H","\u021f":"h","J\u030c":"J","\u01f0":"j","\u01e8":"K","\u01e9":"k","M\u030c":"M","m\u030c":"m","P\u030c":"P","p\u030c":"p","Q\u030c":"Q","q\u030c":"q","\u0158\u0329":"R","\u0159\u0329":"r","\u1e66":"S","\u1e67":"s","V\u030c":"V","v\u030c":"v","W\u030c":"W","w\u030c":"w","X\u030c":"X","x\u030c":"x","Y\u030c":"Y","y\u030c":"y","A\u0327":"A","a\u0327":"a","B\u0327":"B","b\u0327":"b","\u1e10":"D","\u1e11":"d","\u0228":"E","\u0229":"e","\u0190\u0327":"E","\u025b\u0327":"e","\u1e28":"H","\u1e29":"h","I\u0327":"I","i\u0327":"i","\u0197\u0327":"I","\u0268\u0327":"i","M\u0327":"M","m\u0327":"m","O\u0327":"O","o\u0327":"o","Q\u0327":"Q","q\u0327":"q","U\u0327":"U","u\u0327":"u","X\u0327":"X","x\u0327":"x","Z\u0327":"Z","z\u0327":"z"},ye=Object.keys(he).join("|"),ve=new RegExp(ye,"g");var me=7,be=6,xe=5,we=4,ke=3,$e=2,Se=1,Ce=0;function Ee(e,t,n){var r;if((n=n||{}).threshold=null!=(r=n.threshold)?r:Se,!n.accessors){const r=qe(e,t,n);return{rankedValue:e,rank:r,accessorIndex:-1,accessorThreshold:n.threshold,passed:r>=n.threshold}}const o=function(e,t){const n=[];for(let r=0,o=t.length;r<o;r++){const o=t[r],i=De(o),s=Fe(e,o);for(let e=0,t=s.length;e<t;e++)n.push({itemValue:s[e],attributes:i})}return n}(e,n.accessors),i={rankedValue:e,rank:Ce,accessorIndex:-1,accessorThreshold:n.threshold,passed:!1};for(let s=0;s<o.length;s++){const e=o[s];let r=qe(e.itemValue,t,n);const{minRanking:a,maxRanking:l,threshold:d=n.threshold}=e.attributes;r<a&&r>=Se?r=a:r>l&&(r=l),r=Math.min(r,l),r>=d&&r>i.rank&&(i.rank=r,i.passed=!0,i.accessorIndex=s,i.accessorThreshold=d,i.rankedValue=e.itemValue)}return i}function qe(e,t,n){return e=Me(e,n),(t=Me(t,n)).length>e.length?Ce:e===t?me:(e=e.toLowerCase())===(t=t.toLowerCase())?be:e.startsWith(t)?xe:e.includes(` ${t}`)?we:e.includes(t)?ke:1===t.length?Ce:function(e){let t="";return e.split(" ").forEach(e=>{e.split("-").forEach(e=>{t+=e.substr(0,1)})}),t}(e).includes(t)?$e:function(e,t){let n=0,r=0;function o(e,t,r){for(let o=r,i=t.length;o<i;o++)if(t[o]===e)return n+=1,o+1;return-1}function i(e){const r=1/e,o=n/t.length;return Se+o*r}const s=o(t[0],e,0);if(s<0)return Ce;r=s;for(let a=1,l=t.length;a<l;a++){if(r=o(t[a],e,r),!(r>-1))return Ce}return i(r-s)}(e,t)}function Me(e,t){let{keepDiacritics:n}=t;return e=`${e}`,n||(e=e.replace(ve,e=>he[e])),e}function Fe(e,t){let n=t;"object"==typeof t&&(n=t.accessor);const r=n(e);return null==r?[]:Array.isArray(r)?r:[String(r)]}var Le={maxRanking:1/0,minRanking:-1/0};function De(e){return"function"==typeof e?Le:{...Le,...e}}var Te={data:""},ze=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Ae=/\/\*[^]*?\*\/|  +/g,Oe=/\n+/g,Ie=(e,t)=>{let n="",r="",o="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?n=i+" "+s+";":r+="f"==i[1]?Ie(s,i):i+"{"+Ie(s,"k"==i[1]?"":t)+"}":"object"==typeof s?r+=Ie(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=Ie.p?Ie.p(i,s):i+":"+s+";")}return n+(t&&o?t+"{"+o+"}":o)+r},Pe={},Ke=e=>{if("object"==typeof e){let t="";for(let n in e)t+=n+Ke(e[n]);return t}return e};function Re(e){let t=this||{},n=e.call?e(t.p):e;return((e,t,n,r,o)=>{let i=Ke(e),s=Pe[i]||(Pe[i]=(e=>{let t=0,n=11;for(;t<e.length;)n=101*n+e.charCodeAt(t++)>>>0;return"go"+n})(i));if(!Pe[s]){let t=i!==e?e:(e=>{let t,n,r=[{}];for(;t=ze.exec(e.replace(Ae,""));)t[4]?r.shift():t[3]?(n=t[3].replace(Oe," ").trim(),r.unshift(r[0][n]=r[0][n]||{})):r[0][t[1]]=t[2].replace(Oe," ").trim();return r[0]})(e);Pe[s]=Ie(o?{["@keyframes "+s]:t}:t,n?"":"."+s)}let a=n&&Pe.g?Pe.g:null;return n&&(Pe.g=Pe[s]),l=Pe[s],d=t,c=r,(u=a)?d.data=d.data.replace(u,l):-1===d.data.indexOf(l)&&(d.data=c?l+d.data:d.data+l),s;var l,d,c,u})(n.unshift?n.raw?((e,t,n)=>e.reduce((e,r,o)=>{let i=t[o];if(i&&i.call){let e=i(n),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":Ie(e,""):!1===e?"":e}return e+r+(null==i?"":i)},""))(n,[].slice.call(arguments,1),t.p):n.reduce((e,n)=>Object.assign(e,n&&n.call?n(t.p):n),{}):n,(r=t.target,"object"==typeof window?((r?r.querySelector("#_goober"):window._goober)||Object.assign((r||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:r||Te),t.g,t.o,t.k);var r}function Be(e){var t,n,r="";if("string"==typeof e||"number"==typeof e)r+=e;else if("object"==typeof e)if(Array.isArray(e)){var o=e.length;for(t=0;t<o;t++)e[t]&&(n=Be(e[t]))&&(r&&(r+=" "),r+=n)}else for(n in e)e[n]&&(r&&(r+=" "),r+=n);return r}function Ge(){for(var e,t,n=0,r="",o=arguments.length;n<o;n++)(e=arguments[n])&&(t=Be(e))&&(r&&(r+=" "),r+=t);return r}Re.bind({g:1}),Re.bind({k:1});var Ue=()=>{};function He(...e){return t=e,(...e)=>{for(const n of t)n&&n(...e)};var t}var Ve=e=>e instanceof Element;function je(e,t){if(t(e))return e;if("function"==typeof e&&!e.length)return je(e(),t);if(Array.isArray(e)){const n=[];for(const r of e){const e=je(r,t);e&&(Array.isArray(e)?n.push.apply(n,e):n.push(e))}return n.length?n:null}return null}function Ne(e,t=Ve,n=Ve){const r=V(e),o=V(()=>je(r(),t));return o.toArray=()=>{const e=o();return Array.isArray(e)?e:e?[e]:[]},o}function We(e){requestAnimationFrame(()=>requestAnimationFrame(e))}function Qe(e,t,n,r){const{onBeforeEnter:o,onEnter:i,onAfterEnter:s}=t;function a(t){t&&t.target!==n||(n.removeEventListener("transitionend",a),n.removeEventListener("animationend",a),n.classList.remove(...e.enterActive),n.classList.remove(...e.enterTo),s?.(n))}o?.(n),n.classList.add(...e.enter),n.classList.add(...e.enterActive),queueMicrotask(()=>{if(!n.parentNode)return r?.();i?.(n,()=>a())}),We(()=>{n.classList.remove(...e.enter),n.classList.add(...e.enterTo),(!i||i.length<2)&&(n.addEventListener("transitionend",a),n.addEventListener("animationend",a))})}function _e(e,t,n,r){const{onBeforeExit:o,onExit:i,onAfterExit:s}=t;if(!n.parentNode)return r?.();function a(t){t&&t.target!==n||(r?.(),n.removeEventListener("transitionend",a),n.removeEventListener("animationend",a),n.classList.remove(...e.exitActive),n.classList.remove(...e.exitTo),s?.(n))}o?.(n),n.classList.add(...e.exit),n.classList.add(...e.exitActive),i?.(n,()=>a()),We(()=>{n.classList.remove(...e.exit),n.classList.add(...e.exitTo),(!i||i.length<2)&&(n.addEventListener("transitionend",a),n.addEventListener("animationend",a))})}var Xe=t=>{const n=function(e){return V(()=>{const t=e.name||"s";return{enterActive:(e.enterActiveClass||t+"-enter-active").split(" "),enter:(e.enterClass||t+"-enter").split(" "),enterTo:(e.enterToClass||t+"-enter-to").split(" "),exitActive:(e.exitActiveClass||t+"-exit-active").split(" "),exit:(e.exitClass||t+"-exit").split(" "),exitTo:(e.exitToClass||t+"-exit-to").split(" "),move:(e.moveClass||t+"-move").split(" ")}})}(t);return function(t,n){const r=w(t),{onChange:o}=n;let i=new Set(n.appear?void 0:r);const s=new WeakSet,[a,l]=N([],{equals:!1}),[d]=e(),c="remove"===n.exitMethod?Ue:e=>{l(t=>(t.push.apply(t,e),t));for(const t of e)s.delete(t)},u="remove"===n.exitMethod?Ue:"keep-index"===n.exitMethod?(e,t,n)=>e.splice(n,0,t):(e,t)=>e.push(t);return V(e=>{const n=a(),r=t();if(r[U],w(d))return d(),e;if(n.length){const t=e.filter(e=>!n.includes(e));return n.length=0,o({list:t,added:[],removed:[],unchanged:t,finishRemoved:c}),t}return w(()=>{const t=new Set(r),n=r.slice(),a=[],l=[],d=[];for(const e of r)(i.has(e)?d:a).push(e);let g=!a.length;for(let r=0;r<e.length;r++){const o=e[r];t.has(o)||(s.has(o)||(l.push(o),s.add(o)),u(n,o,r)),g&&o!==n[r]&&(g=!1)}return!l.length&&g?e:(o({list:n,added:a,removed:l,unchanged:d,finishRemoved:c}),i=t,n)})},n.appear?[]:r.slice())}(Ne(()=>t.children).toArray,{appear:t.appear,exitMethod:"keep-index",onChange({added:e,removed:r,finishRemoved:o,list:i}){const s=n();for(const n of e)Qe(s,t,n);const a=[];for(const t of i)t.isConnected&&(t instanceof HTMLElement||t instanceof SVGElement)&&a.push({el:t,rect:t.getBoundingClientRect()});queueMicrotask(()=>{const e=[];for(const{el:t,rect:n}of a)if(t.isConnected){const r=t.getBoundingClientRect(),o=n.left-r.left,i=n.top-r.top;(o||i)&&(t.style.transform=`translate(${o}px, ${i}px)`,t.style.transitionDuration="0s",e.push(t))}document.body.offsetHeight;for(const t of e){let e=function(n){(n.target===t||/transform$/.test(n.propertyName))&&(t.removeEventListener("transitionend",e),t.classList.remove(...s.move))};t.classList.add(...s.move),t.style.transform=t.style.transitionDuration="",t.addEventListener("transitionend",e)}});for(const n of r)_e(s,t,n,()=>o([n]))}})},Ze=Symbol("fallback");function Ye(e){for(const t of e)t.dispose()}function Je(e){const{by:t}=e;return V(function(e,t,n,r={}){const o=new Map;return h(()=>Ye(o.values())),()=>{const n=e()||[];return n[U],w(()=>{if(!n.length)return Ye(o.values()),o.clear(),r.fallback?[C(e=>(o.set(Ze,{dispose:e}),r.fallback()))]:[];const e=new Array(n.length),s=o.get(Ze);if(!o.size||s){s?.dispose(),o.delete(Ze);for(let r=0;r<n.length;r++){const o=n[r];i(e,o,r,t(o,r))}return e}const a=new Set(o.keys());for(let r=0;r<n.length;r++){const s=n[r],l=t(s,r);a.delete(l);const d=o.get(l);d?(e[r]=d.mapped,d.setIndex?.(r),d.setItem(()=>s)):i(e,s,r,l)}for(const t of a)o.get(t)?.dispose(),o.delete(t);return e})};function i(e,t,r,i){C(s=>{const[a,l]=N(t),d={setItem:l,dispose:s};if(n.length>1){const[e,t]=N(r);d.setIndex=t,d.mapped=n(a,e)}else d.mapped=n(a);o.set(i,d),e[r]=d.mapped})}}(()=>e.each,"function"==typeof t?t:e=>e[t],e.children,"fallback"in e?{fallback:()=>e.fallback}:void 0))}function et(e,t,n,r){const o=()=>{Z(X(e)).forEach(e=>{e&&Z(X(t)).forEach(t=>function(e,t,n,r){return e.addEventListener(t,n,r),Y(e.removeEventListener.bind(e,t,n,r))}(e,t,n,r))})};"function"==typeof e?$(o):W(o)}function tt(e,t,n){const r=new WeakMap,{observe:o,unobserve:i}=function(e,t){const n=new ResizeObserver(e);return h(n.disconnect.bind(n)),{observe:e=>n.observe(e,t),unobserve:n.unobserve.bind(n)}}(e=>{for(const n of e){const{contentRect:e,target:o}=n,i=Math.round(e.width),s=Math.round(e.height),a=r.get(o);a&&a.width===i&&a.height===s||(t(e,o,n),r.set(o,{width:i,height:s}))}},n);$(t=>{const n=Z(X(e)).filter(_);return function(e,t,n,r){const o=e.length,i=t.length;let s,a,l=0;if(i)if(o){for(;l<i&&t[l]===e[l];l++);for(s of(t=t.slice(l),e=e.slice(l),t))e.includes(s)||r(s);for(a of e)t.includes(a)||n(a)}else for(;l<i;l++)r(t[l]);else for(;l<o;l++)n(e[l])}(n,t,o,i),n},[])}var nt=/((?:--)?(?:\w+-?)+)\s*:\s*([^;]*)/g;function rt(e){const t={};let n;for(;n=nt.exec(e);)t[n[1]]=n[2];return t}function ot(e,t){if("string"==typeof e){if("string"==typeof t)return`${e};${t}`;e=rt(e)}else"string"==typeof t&&(t=rt(t));return{...e,...t}}function it(e,t){const n=[...e],r=n.indexOf(t);return-1!==r&&n.splice(r,1),n}function st(e){return"number"==typeof e}function at(e){return"[object String]"===Object.prototype.toString.call(e)}function lt(e){return t=>`${e()}-${t}`}function dt(e,t){return!!e&&(e===t||e.contains(t))}function ct(e,t=!1){const{activeElement:n}=ut(e);if(!n?.nodeName)return null;if(gt(n)&&n.contentDocument)return ct(n.contentDocument.body,t);if(t){const e=n.getAttribute("aria-activedescendant");if(e){const t=ut(n).getElementById(e);if(t)return t}}return n}function ut(e){return e?e.ownerDocument||e:document}function gt(e){return"IFRAME"===e.tagName}var ft=(e=>(e.Escape="Escape",e.Enter="Enter",e.Tab="Tab",e.Space=" ",e.ArrowDown="ArrowDown",e.ArrowLeft="ArrowLeft",e.ArrowRight="ArrowRight",e.ArrowUp="ArrowUp",e.End="End",e.Home="Home",e.PageDown="PageDown",e.PageUp="PageUp",e))(ft||{});function pt(e){return"undefined"!=typeof window&&null!=window.navigator&&e.test(window.navigator.userAgentData?.platform||window.navigator.platform)}function ht(){return pt(/^Mac/i)}function yt(){return pt(/^iPhone/i)||pt(/^iPad/i)||ht()&&navigator.maxTouchPoints>1}function vt(e,t){return t&&("function"==typeof t?t(e):t[0](t[1],e)),e?.defaultPrevented}function mt(e){return t=>{for(const n of e)vt(t,n)}}function bt(e){return ht()?e.metaKey&&!e.ctrlKey:e.ctrlKey&&!e.metaKey}function xt(e){if(e)if(function(){if(null==wt){wt=!1;try{document.createElement("div").focus({get preventScroll(){return wt=!0,!0}})}catch(e){}}return wt}())e.focus({preventScroll:!0});else{const t=function(e){let t=e.parentNode;const n=[],r=document.scrollingElement||document.documentElement;for(;t instanceof HTMLElement&&t!==r;)(t.offsetHeight<t.scrollHeight||t.offsetWidth<t.scrollWidth)&&n.push({element:t,scrollTop:t.scrollTop,scrollLeft:t.scrollLeft}),t=t.parentNode;r instanceof HTMLElement&&n.push({element:r,scrollTop:r.scrollTop,scrollLeft:r.scrollLeft});return n}(e);e.focus(),function(e){for(const{element:t,scrollTop:n,scrollLeft:r}of e)t.scrollTop=n,t.scrollLeft=r}(t)}}var wt=null;var kt=["input:not([type='hidden']):not([disabled])","select:not([disabled])","textarea:not([disabled])","button:not([disabled])","a[href]","area[href]","[tabindex]","iframe","object","embed","audio[controls]","video[controls]","[contenteditable]:not([contenteditable='false'])"],$t=[...kt,'[tabindex]:not([tabindex="-1"]):not([disabled])'],St=kt.join(":not([hidden]),")+",[tabindex]:not([disabled]):not([hidden])",Ct=$t.join(':not([hidden]):not([tabindex="-1"]),');function Et(e,t){const n=Array.from(e.querySelectorAll(St)).filter(qt);return t&&qt(e)&&n.unshift(e),n.forEach((e,t)=>{if(gt(e)&&e.contentDocument){const r=Et(e.contentDocument.body,!1);n.splice(t,1,...r)}}),n}function qt(e){return Mt(e)&&!function(e){return parseInt(e.getAttribute("tabindex")||"0",10)<0}(e)}function Mt(e){return e.matches(St)&&Ft(e)}function Ft(e,t){return"#comment"!==e.nodeName&&function(e){if(!(e instanceof HTMLElement||e instanceof SVGElement))return!1;const{display:t,visibility:n}=e.style;let r="none"!==t&&"hidden"!==n&&"collapse"!==n;if(r){if(!e.ownerDocument.defaultView)return r;const{getComputedStyle:t}=e.ownerDocument.defaultView,{display:n,visibility:o}=t(e);r="none"!==n&&"hidden"!==o&&"collapse"!==o}return r}(e)&&function(e,t){return!e.hasAttribute("hidden")&&("DETAILS"!==e.nodeName||!t||"SUMMARY"===t.nodeName||e.hasAttribute("open"))}(e,t)&&(!e.parentElement||Ft(e.parentElement,e))}function Lt(e){for(;e&&!Dt(e);)e=e.parentElement;return e||document.scrollingElement||document.documentElement}function Dt(e){const t=window.getComputedStyle(e);return/(auto|scroll)/.test(t.overflow+t.overflowX+t.overflowY)}function Tt(){}function zt(e,t){return i(e,t)}var At=new Map,Ot=new Set;function It(){if("undefined"==typeof window)return;const e=t=>{if(!t.target)return;const n=At.get(t.target);if(n&&(n.delete(t.propertyName),0===n.size&&(t.target.removeEventListener("transitioncancel",e),At.delete(t.target)),0===At.size)){for(const e of Ot)e();Ot.clear()}};document.body.addEventListener("transitionrun",t=>{if(!t.target)return;let n=At.get(t.target);n||(n=new Set,At.set(t.target,n),t.target.addEventListener("transitioncancel",e)),n.add(t.propertyName)}),document.body.addEventListener("transitionend",e)}function Pt(e,t){const n=Kt(e,t,"left"),r=Kt(e,t,"top"),o=t.offsetWidth,i=t.offsetHeight;let s=e.scrollLeft,a=e.scrollTop;const l=s+e.offsetWidth,d=a+e.offsetHeight;n<=s?s=n:n+o>l&&(s+=n+o-l),r<=a?a=r:r+i>d&&(a+=r+i-d),e.scrollLeft=s,e.scrollTop=a}function Kt(e,t,n){const r="left"===n?"offsetLeft":"offsetTop";let o=0;for(;t.offsetParent&&(o+=t[r],t.offsetParent!==e);){if(t.offsetParent.contains(e)){o-=e[r];break}t=t.offsetParent}return o}"undefined"!=typeof document&&("loading"!==document.readyState?It():document.addEventListener("DOMContentLoaded",It));var Rt={border:"0",clip:"rect(0 0 0 0)","clip-path":"inset(50%)",height:"1px",margin:"0 -1px -1px 0",overflow:"hidden",padding:"0",position:"absolute",width:"1px","white-space":"nowrap"};function Bt(e){return t=>(e(t),()=>e(void 0))}function Gt(e,t){const[n,r]=N(Ut(t?.()));return $(()=>{r(e()?.tagName.toLowerCase()||Ut(t?.()))}),n}function Ut(e){return at(e)?e:void 0}function Ht(e){const[t,n]=s(e,["as"]);if(!t.as)throw new Error("[kobalte]: Polymorphic is missing the required `as` prop.");return O(I,i(n,{get component(){return t.as}}))}var Vt=["id","name","validationState","required","disabled","readOnly"];var jt=F();function Nt(){const e=p(jt);if(void 0===e)throw new Error("[kobalte]: `useFormControlContext` must be used within a `FormControlContext.Provider` component");return e}function Wt(e){const t=Nt(),n=zt({id:t.generateId("description")},e);return $(()=>h(t.registerDescription(n.id))),O(Ht,i({as:"div"},()=>t.dataset(),n))}function Qt(e){const t=Nt(),[n,r]=s(zt({id:t.generateId("error-message")},e),["forceMount"]),o=()=>"invalid"===t.validationState();return $(()=>{o()&&h(t.registerErrorMessage(r.id))}),O(G,{get when(){return n.forceMount||o()},get children(){return O(Ht,i({as:"div"},()=>t.dataset(),r))}})}function _t(e){let t;const n=Nt(),[r,o]=s(zt({id:n.generateId("label")},e),["ref"]),a=Gt(()=>t,()=>"label");return $(()=>h(n.registerLabel(o.id))),O(Ht,i({as:"label",ref(e){const n=He(e=>t=e,r.ref);"function"==typeof n&&n(e)},get for(){return V(()=>"label"===a())()?n.fieldId():void 0}},()=>n.dataset(),o))}function Xt(e,t){$(u(e,e=>{if(null==e)return;const n=function(e){return function(e){return e.matches("textarea, input, select, button")}(e)?e.form:e.closest("form")}(e);null!=n&&(n.addEventListener("reset",t,{passive:!0}),h(()=>{n.removeEventListener("reset",t)}))}))}function Zt(e){const[t,n]=N(e.defaultValue?.()),r=V(()=>void 0!==e.value?.()),o=V(()=>r()?e.value?.():t());return[o,t=>{w(()=>{const i=function(e,...t){return"function"==typeof e?e(...t):e}(t,o());return Object.is(i,o())||(r()||n(i),e.onChange?.(i)),i})}]}function Yt(e){const[t,n]=Zt(e);return[()=>t()??!1,n]}var Jt=Object.defineProperty,en=(e,t)=>{for(var n in t)Jt(e,n,{get:t[n],enumerable:!0})},tn=F();function nn(){return p(tn)}function rn(e,t){return Boolean(t.compareDocumentPosition(e)&Node.DOCUMENT_POSITION_PRECEDING)}function on(e,t){const n=function(e){const t=e.map((e,t)=>[t,e]);let n=!1;return t.sort(([e,t],[r,o])=>{const i=t.ref(),s=o.ref();return i===s?0:i&&s?rn(i,s)?(e>r&&(n=!0),-1):(e<r&&(n=!0),1):0}),n?t.map(([e,t])=>t):e}(e);e!==n&&t(n)}function sn(e,t){if("function"!=typeof IntersectionObserver)return void function(e,t){$(()=>{const n=setTimeout(()=>{on(e(),t)});h(()=>clearTimeout(n))})}(e,t);let n=[];$(()=>{const r=function(e){const t=e[0],n=e[e.length-1]?.ref();let r=t?.ref()?.parentElement;for(;r;){if(n&&r.contains(n))return r;r=r.parentElement}return ut(r).body}(e()),o=new IntersectionObserver(()=>{const r=!!n.length;n=e(),r&&on(e(),t)},{root:r});for(const t of e()){const e=t.ref();e&&o.observe(e)}h(()=>o.disconnect())})}function an(e={}){const[t,n]=function(e){const[t,n]=Zt(e);return[()=>t()??[],n]}({value:()=>X(e.items),onChange:t=>e.onItemsChange?.(t)});sn(t,n);const r=e=>(n(t=>function(e,t,n=-1){return n in e?[...e.slice(0,n),t,...e.slice(n)]:[...e,t]}(t,e,function(e,t){const n=t.ref();if(!n)return-1;let r=e.length;if(!r)return-1;for(;r--;){const t=e[r]?.ref();if(t&&rn(t,n))return r+1}return 0}(t,e))),()=>{n(t=>{const n=t.filter(t=>t.ref()!==e.ref());return t.length===n.length?t:n})});return{DomCollectionProvider:e=>O(tn.Provider,{value:{registerItem:r},get children(){return e.children}})}}function ln(e){const t=function(){const e=nn();if(void 0===e)throw new Error("[kobalte]: `useDomCollectionContext` must be used within a `DomCollectionProvider` component");return e}(),n=zt({shouldRegisterItem:!0},e);$(()=>{n.shouldRegisterItem&&h(t.registerItem(n.getItem()))})}function dn(e){let t=e.startIndex??0;const n=e.startLevel??0,r=[],o=t=>{if(null==t)return"";const n=e.getKey??"key",r=at(n)?t[n]:n(t);return null!=r?String(r):""},i=t=>{if(null==t)return"";const n=e.getTextValue??"textValue",r=at(n)?t[n]:n(t);return null!=r?String(r):""},s=t=>{if(null==t)return!1;const n=e.getDisabled??"disabled";return(at(n)?t[n]:n(t))??!1},a=t=>{if(null!=t)return at(e.getSectionChildren)?t[e.getSectionChildren]:e.getSectionChildren?.(t)};for(const l of e.dataSource)if(at(l)||st(l))r.push({type:"item",rawValue:l,key:String(l),textValue:String(l),disabled:s(l),level:n,index:t}),t++;else if(null!=a(l)){r.push({type:"section",rawValue:l,key:"",textValue:"",disabled:!1,level:n,index:t}),t++;const o=a(l)??[];if(o.length>0){const i=dn({dataSource:o,getKey:e.getKey,getTextValue:e.getTextValue,getDisabled:e.getDisabled,getSectionChildren:e.getSectionChildren,startIndex:t,startLevel:n+1});r.push(...i),t+=i.length}}else r.push({type:"item",rawValue:l,key:o(l),textValue:i(l),disabled:s(l),level:n,index:t}),t++;return r}function cn(e,t=[]){return V(()=>{const n=dn({dataSource:X(e.dataSource),getKey:X(e.getKey),getTextValue:X(e.getTextValue),getDisabled:X(e.getDisabled),getSectionChildren:X(e.getSectionChildren)});for(let e=0;e<t.length;e++)t[e]();return e.factory(n)})}var un=new Set(["Avst","Arab","Armi","Syrc","Samr","Mand","Thaa","Mend","Nkoo","Adlm","Rohg","Hebr"]),gn=new Set(["ae","ar","arc","bcc","bqi","ckb","dv","fa","glk","he","ku","mzn","nqo","pnb","ps","sd","ug","ur","yi"]);function fn(e){return function(e){if(Intl.Locale){const t=new Intl.Locale(e).maximize().script??"";return un.has(t)}const t=e.split("-")[0];return gn.has(t)}(e)?"rtl":"ltr"}function pn(){let e="undefined"!=typeof navigator&&(navigator.language||navigator.userLanguage)||"en-US";return{locale:e,direction:fn(e)}}var hn=pn(),yn=new Set;function vn(){hn=pn();for(const e of yn)e(hn)}var mn=F();function bn(){const e=function(){const[e,t]=N(hn),n=V(()=>e());return Q(()=>{0===yn.size&&window.addEventListener("languagechange",vn),yn.add(t),h(()=>{yn.delete(t),0===yn.size&&window.removeEventListener("languagechange",vn)})}),{locale:()=>n().locale,direction:()=>n().direction}}();return p(mn)||e}var xn=new Map;var wn=class e extends Set{anchorKey;currentKey;constructor(t,n,r){super(t),t instanceof e?(this.anchorKey=n||t.anchorKey,this.currentKey=r||t.currentKey):(this.anchorKey=n,this.currentKey=r)}};function kn(e){return ht()||yt()?e.altKey:e.ctrlKey}function $n(e){return ht()?e.metaKey:e.ctrlKey}function Sn(e){return new wn(e)}function Cn(e){const t=zt({selectionMode:"none",selectionBehavior:"toggle"},e),[n,r]=N(!1),[o,i]=N(),[s,a]=function(e){const[t,n]=Zt(e);return[()=>t()??new wn,n]}({value:V(()=>{const e=X(t.selectedKeys);return null!=e?Sn(e):e}),defaultValue:V(()=>{const e=X(t.defaultSelectedKeys);return null!=e?Sn(e):new wn}),onChange:e=>t.onSelectionChange?.(e)}),[l,d]=N(X(t.selectionBehavior));return $(()=>{const e=s();"replace"===X(t.selectionBehavior)&&"toggle"===l()&&"object"==typeof e&&0===e.size&&d("replace")}),$(()=>{d(X(t.selectionBehavior)??"toggle")}),{selectionMode:()=>X(t.selectionMode),disallowEmptySelection:()=>X(t.disallowEmptySelection)??!1,selectionBehavior:l,setSelectionBehavior:d,isFocused:n,setFocused:r,focusedKey:o,setFocusedKey:i,selectedKeys:s,setSelectedKeys:e=>{!X(t.allowDuplicateSelectionEvents)&&function(e,t){if(e.size!==t.size)return!1;for(const n of e)if(!t.has(n))return!1;return!0}(e,s())||a(e)}}}function En(e,t,n){const r=i({selectOnFocus:()=>"replace"===X(e.selectionManager).selectionBehavior()},e),o=()=>t(),{direction:s}=bn();let a={top:0,left:0};et(()=>X(r.isVirtualized)?void 0:o(),"scroll",()=>{const e=o();e&&(a={top:e.scrollTop,left:e.scrollLeft})});const{typeSelectHandlers:l}=function(e){const[t,n]=N(""),[r,o]=N(-1);return{typeSelectHandlers:{onKeyDown:i=>{if(X(e.isDisabled))return;const s=X(e.keyboardDelegate),a=X(e.selectionManager);if(!s.getKeyForSearch)return;const l=function(e){return 1!==e.length&&/^[A-Z]/i.test(e)?"":e}(i.key);if(!l||i.ctrlKey||i.metaKey)return;" "===l&&t().trim().length>0&&(i.preventDefault(),i.stopPropagation());let d=n(e=>e+l),c=s.getKeyForSearch(d,a.focusedKey())??s.getKeyForSearch(d);null==c&&function(e){return e.split("").every(t=>t===e[0])}(d)&&(d=d[0],c=s.getKeyForSearch(d,a.focusedKey())??s.getKeyForSearch(d)),null!=c&&(a.setFocusedKey(c),e.onTypeSelect?.(c)),clearTimeout(r()),o(window.setTimeout(()=>n(""),500))}}}}({isDisabled:()=>X(r.disallowTypeAhead),keyboardDelegate:()=>X(r.keyboardDelegate),selectionManager:()=>X(r.selectionManager)}),d=()=>X(r.orientation)??"vertical",c=()=>{const e=X(r.autoFocus);if(!e)return;const n=X(r.selectionManager),o=X(r.keyboardDelegate);let i;"first"===e&&(i=o.getFirstKey?.()),"last"===e&&(i=o.getLastKey?.());const s=n.selectedKeys();s.size&&(i=s.values().next().value),n.setFocused(!0),n.setFocusedKey(i);const a=t();a&&null==i&&!X(r.shouldUseVirtualFocus)&&xt(a)};return Q(()=>{r.deferAutoFocus?setTimeout(c,0):c()}),$(u([o,()=>X(r.isVirtualized),()=>X(r.selectionManager).focusedKey()],e=>{const[t,n,o]=e;if(n)o&&r.scrollToKey?.(o);else if(o&&t){const e=t.querySelector(`[data-key="${o}"]`);e&&Pt(t,e)}})),{tabIndex:V(()=>{if(!X(r.shouldUseVirtualFocus))return null==X(r.selectionManager).focusedKey()?0:-1}),onKeyDown:e=>{vt(e,l.onKeyDown),e.altKey&&"Tab"===e.key&&e.preventDefault();const n=t();if(!n?.contains(e.target))return;const o=X(r.selectionManager),i=X(r.selectOnFocus),a=t=>{null!=t&&(o.setFocusedKey(t),e.shiftKey&&"multiple"===o.selectionMode()?o.extendSelection(t):i&&!kn(e)&&o.replaceSelection(t))},c=X(r.keyboardDelegate),u=X(r.shouldFocusWrap),g=o.focusedKey();switch(e.key){case"vertical"===d()?"ArrowDown":"ArrowRight":if(c.getKeyBelow){let t;e.preventDefault(),t=null!=g?c.getKeyBelow(g):c.getFirstKey?.(),null==t&&u&&(t=c.getFirstKey?.(g)),a(t)}break;case"vertical"===d()?"ArrowUp":"ArrowLeft":if(c.getKeyAbove){let t;e.preventDefault(),t=null!=g?c.getKeyAbove(g):c.getLastKey?.(),null==t&&u&&(t=c.getLastKey?.(g)),a(t)}break;case"vertical"===d()?"ArrowLeft":"ArrowUp":if(c.getKeyLeftOf){e.preventDefault();const t="rtl"===s();let n;n=null!=g?c.getKeyLeftOf(g):t?c.getFirstKey?.():c.getLastKey?.(),a(n)}break;case"vertical"===d()?"ArrowRight":"ArrowDown":if(c.getKeyRightOf){e.preventDefault();const t="rtl"===s();let n;n=null!=g?c.getKeyRightOf(g):t?c.getLastKey?.():c.getFirstKey?.(),a(n)}break;case"Home":if(c.getFirstKey){e.preventDefault();const t=c.getFirstKey(g,$n(e));null!=t&&(o.setFocusedKey(t),$n(e)&&e.shiftKey&&"multiple"===o.selectionMode()?o.extendSelection(t):i&&o.replaceSelection(t))}break;case"End":if(c.getLastKey){e.preventDefault();const t=c.getLastKey(g,$n(e));null!=t&&(o.setFocusedKey(t),$n(e)&&e.shiftKey&&"multiple"===o.selectionMode()?o.extendSelection(t):i&&o.replaceSelection(t))}break;case"PageDown":c.getKeyPageBelow&&null!=g&&(e.preventDefault(),a(c.getKeyPageBelow(g)));break;case"PageUp":c.getKeyPageAbove&&null!=g&&(e.preventDefault(),a(c.getKeyPageAbove(g)));break;case"a":$n(e)&&"multiple"===o.selectionMode()&&!0!==X(r.disallowSelectAll)&&(e.preventDefault(),o.selectAll());break;case"Escape":e.defaultPrevented||(e.preventDefault(),X(r.disallowEmptySelection)||o.clearSelection());break;case"Tab":if(!X(r.allowsTabNavigation)){if(e.shiftKey)n.focus();else{const e=function(e,t,n){const r=t?.tabbable?Ct:St,o=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:e=>t?.from?.contains(e)?NodeFilter.FILTER_REJECT:!e.matches(r)||!Ft(e)||n||t?.accept&&!t.accept(e)?NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT});return t?.from&&(o.currentNode=t.from),o}(n,{tabbable:!0});let t,r;do{r=e.lastChild(),r&&(t=r)}while(r);t&&!t.contains(document.activeElement)&&xt(t)}break}}},onMouseDown:e=>{o()===e.target&&e.preventDefault()},onFocusIn:e=>{const t=X(r.selectionManager),n=X(r.keyboardDelegate),i=X(r.selectOnFocus);if(t.isFocused())e.currentTarget.contains(e.target)||t.setFocused(!1);else if(e.currentTarget.contains(e.target))if(t.setFocused(!0),null==t.focusedKey()){const r=e=>{null!=e&&(t.setFocusedKey(e),i&&t.replaceSelection(e))},o=e.relatedTarget;o&&e.currentTarget.compareDocumentPosition(o)&Node.DOCUMENT_POSITION_FOLLOWING?r(t.lastSelectedKey()??n.getLastKey?.()):r(t.firstSelectedKey()??n.getFirstKey?.())}else if(!X(r.isVirtualized)){const e=o();if(e){e.scrollTop=a.top,e.scrollLeft=a.left;const n=e.querySelector(`[data-key="${t.focusedKey()}"]`);n&&(xt(n),Pt(e,n))}}},onFocusOut:e=>{const t=X(r.selectionManager);e.currentTarget.contains(e.relatedTarget)||t.setFocused(!1)}}}function qn(e,t){const n=()=>X(e.selectionManager),r=()=>X(e.key),o=()=>X(e.shouldUseVirtualFocus),i=e=>{"none"!==n().selectionMode()&&("single"===n().selectionMode()?n().isSelected(r())&&!n().disallowEmptySelection()?n().toggleSelection(r()):n().replaceSelection(r()):e?.shiftKey?n().extendSelection(r()):"toggle"===n().selectionBehavior()||$n(e)||"pointerType"in e&&"touch"===e.pointerType?n().toggleSelection(r()):n().replaceSelection(r()))},s=()=>X(e.disabled)||n().isDisabled(r()),a=()=>!s()&&n().canSelectItem(r());let l=null;const d=V(()=>{if(!o()&&!s())return r()===n().focusedKey()?0:-1}),c=V(()=>X(e.virtualized)?void 0:r());return $(u([t,r,o,()=>n().focusedKey(),()=>n().isFocused()],([t,n,r,o,i])=>{t&&n===o&&i&&!r&&document.activeElement!==t&&(e.focus?e.focus():xt(t))})),{isSelected:()=>n().isSelected(r()),isDisabled:s,allowsSelection:a,tabIndex:d,dataKey:c,onPointerDown:t=>{a()&&(l=t.pointerType,"mouse"!==t.pointerType||0!==t.button||X(e.shouldSelectOnPressUp)||i(t))},onPointerUp:t=>{a()&&"mouse"===t.pointerType&&0===t.button&&X(e.shouldSelectOnPressUp)&&X(e.allowsDifferentPressOrigin)&&i(t)},onClick:t=>{a()&&(X(e.shouldSelectOnPressUp)&&!X(e.allowsDifferentPressOrigin)||"mouse"!==l)&&i(t)},onKeyDown:e=>{a()&&["Enter"," "].includes(e.key)&&(kn(e)?n().toggleSelection(r()):i(e))},onMouseDown:e=>{s()&&e.preventDefault()},onFocus:e=>{const i=t();o()||s()||!i||e.target===i&&n().setFocusedKey(r())}}}var Mn=class{collection;state;constructor(e,t){this.collection=e,this.state=t}selectionMode(){return this.state.selectionMode()}disallowEmptySelection(){return this.state.disallowEmptySelection()}selectionBehavior(){return this.state.selectionBehavior()}setSelectionBehavior(e){this.state.setSelectionBehavior(e)}isFocused(){return this.state.isFocused()}setFocused(e){this.state.setFocused(e)}focusedKey(){return this.state.focusedKey()}setFocusedKey(e){(null==e||this.collection().getItem(e))&&this.state.setFocusedKey(e)}selectedKeys(){return this.state.selectedKeys()}isSelected(e){if("none"===this.state.selectionMode())return!1;const t=this.getKey(e);return null!=t&&this.state.selectedKeys().has(t)}isEmpty(){return 0===this.state.selectedKeys().size}isSelectAll(){if(this.isEmpty())return!1;const e=this.state.selectedKeys();return this.getAllSelectableKeys().every(t=>e.has(t))}firstSelectedKey(){let e;for(const t of this.state.selectedKeys()){const n=this.collection().getItem(t),r=null!=n?.index&&null!=e?.index&&n.index<e.index;e&&!r||(e=n)}return e?.key}lastSelectedKey(){let e;for(const t of this.state.selectedKeys()){const n=this.collection().getItem(t),r=null!=n?.index&&null!=e?.index&&n.index>e.index;e&&!r||(e=n)}return e?.key}extendSelection(e){if("none"===this.selectionMode())return;if("single"===this.selectionMode())return void this.replaceSelection(e);const t=this.getKey(e);if(null==t)return;const n=this.state.selectedKeys(),r=n.anchorKey||t,o=new wn(n,r,t);for(const i of this.getKeyRange(r,n.currentKey||t))o.delete(i);for(const i of this.getKeyRange(t,r))this.canSelectItem(i)&&o.add(i);this.state.setSelectedKeys(o)}getKeyRange(e,t){const n=this.collection().getItem(e),r=this.collection().getItem(t);return n&&r?null!=n.index&&null!=r.index&&n.index<=r.index?this.getKeyRangeInternal(e,t):this.getKeyRangeInternal(t,e):[]}getKeyRangeInternal(e,t){const n=[];let r=e;for(;null!=r;){const e=this.collection().getItem(r);if(e&&"item"===e.type&&n.push(r),r===t)return n;r=this.collection().getKeyAfter(r)}return[]}getKey(e){const t=this.collection().getItem(e);return t?t&&"item"===t.type?t.key:null:e}toggleSelection(e){if("none"===this.selectionMode())return;if("single"===this.selectionMode()&&!this.isSelected(e))return void this.replaceSelection(e);const t=this.getKey(e);if(null==t)return;const n=new wn(this.state.selectedKeys());n.has(t)?n.delete(t):this.canSelectItem(t)&&(n.add(t),n.anchorKey=t,n.currentKey=t),this.disallowEmptySelection()&&0===n.size||this.state.setSelectedKeys(n)}replaceSelection(e){if("none"===this.selectionMode())return;const t=this.getKey(e);if(null==t)return;const n=this.canSelectItem(t)?new wn([t],t,t):new wn;this.state.setSelectedKeys(n)}setSelectedKeys(e){if("none"===this.selectionMode())return;const t=new wn;for(const n of e){const e=this.getKey(n);if(null!=e&&(t.add(e),"single"===this.selectionMode()))break}this.state.setSelectedKeys(t)}selectAll(){"multiple"===this.selectionMode()&&this.state.setSelectedKeys(new Set(this.getAllSelectableKeys()))}clearSelection(){const e=this.state.selectedKeys();!this.disallowEmptySelection()&&e.size>0&&this.state.setSelectedKeys(new wn)}toggleSelectAll(){this.isSelectAll()?this.clearSelection():this.selectAll()}select(e,t){"none"!==this.selectionMode()&&("single"===this.selectionMode()?this.isSelected(e)&&!this.disallowEmptySelection()?this.toggleSelection(e):this.replaceSelection(e):"toggle"===this.selectionBehavior()||t&&"touch"===t.pointerType?this.toggleSelection(e):this.replaceSelection(e))}isSelectionEqual(e){if(e===this.state.selectedKeys())return!0;const t=this.selectedKeys();if(e.size!==t.size)return!1;for(const n of e)if(!t.has(n))return!1;for(const n of t)if(!e.has(n))return!1;return!0}canSelectItem(e){if("none"===this.state.selectionMode())return!1;const t=this.collection().getItem(e);return null!=t&&!t.disabled}isDisabled(e){const t=this.collection().getItem(e);return!t||t.disabled}getAllSelectableKeys(){const e=[];return(t=>{for(;null!=t;){if(this.canSelectItem(t)){const n=this.collection().getItem(t);if(!n)continue;"item"===n.type&&e.push(t)}t=this.collection().getKeyAfter(t)}})(this.collection().getFirstKey()),e}},Fn=class{keyMap=new Map;iterable;firstKey;lastKey;constructor(e){this.iterable=e;for(const r of e)this.keyMap.set(r.key,r);if(0===this.keyMap.size)return;let t,n=0;for(const[r,o]of this.keyMap)t?(t.nextKey=r,o.prevKey=t.key):(this.firstKey=r,o.prevKey=void 0),"item"===o.type&&(o.index=n++),t=o,t.nextKey=void 0;this.lastKey=t.key}*[Symbol.iterator](){yield*this.iterable}getSize(){return this.keyMap.size}getKeys(){return this.keyMap.keys()}getKeyBefore(e){return this.keyMap.get(e)?.prevKey}getKeyAfter(e){return this.keyMap.get(e)?.nextKey}getFirstKey(){return this.firstKey}getLastKey(){return this.lastKey}getItem(e){return this.keyMap.get(e)}at(e){const t=[...this.getKeys()];return this.getItem(t[e])}};var Ln,Dn=e=>"function"==typeof e?e():e,Tn=e=>{const t=V(()=>{const t=Dn(e.element);if(t)return getComputedStyle(t)}),n=()=>t()?.animationName??"none",[r,o]=N(Dn(e.show)?"present":"hidden");let i="none";return $(r=>{const s=Dn(e.show);return w(()=>{if(r===s)return s;const e=i,a=n();s?o("present"):"none"===a||"none"===t()?.display?o("hidden"):o(!0===r&&e!==a?"hiding":"hidden")}),s}),$(()=>{const t=Dn(e.element);if(!t)return;const s=e=>{e.target===t&&(i=n())},a=e=>{const i=n().includes(e.animationName);e.target===t&&i&&"hiding"===r()&&o("hidden")};t.addEventListener("animationstart",s),t.addEventListener("animationcancel",a),t.addEventListener("animationend",a),h(()=>{t.removeEventListener("animationstart",s),t.removeEventListener("animationcancel",a),t.removeEventListener("animationend",a)})}),{present:()=>"present"===r()||"hiding"===r(),state:r}},zn="data-kb-top-layer",An=!1,On=[];function In(e){return On.findIndex(t=>t.node===e)}function Pn(){return On.filter(e=>e.isPointerBlocking)}function Kn(){return Pn().length>0}function Rn(e){const t=In([...Pn()].slice(-1)[0]?.node);return In(e)<t}var Bn={layers:On,isTopMostLayer:function(e){return On[On.length-1].node===e},hasPointerBlockingLayer:Kn,isBelowPointerBlockingLayer:Rn,addLayer:function(e){On.push(e)},removeLayer:function(e){const t=In(e);t<0||On.splice(t,1)},indexOf:In,find:function(e){return On[In(e)]},assignPointerEventToLayers:function(){for(const{node:e}of On)e.style.pointerEvents=Rn(e)?"none":"auto"},disableBodyPointerEvents:function(e){if(Kn()&&!An){const t=ut(e);Ln=document.body.style.pointerEvents,t.body.style.pointerEvents="none",An=!0}},restoreBodyPointerEvents:function(e){if(Kn())return;const t=ut(e);t.body.style.pointerEvents=Ln,0===t.body.style.length&&t.body.removeAttribute("style"),An=!1}};en({},{Button:()=>Hn,Root:()=>Un});var Gn=["button","color","file","image","reset","submit"];function Un(e){let t;const[n,r]=s(zt({type:"button"},e),["ref","type","disabled"]),o=Gt(()=>t,()=>"button"),a=V(()=>{const e=o();return null!=e&&function(e){const t=e.tagName.toLowerCase();return"button"===t||!("input"!==t||!e.type)&&-1!==Gn.indexOf(e.type)}({tagName:e,type:n.type})}),l=V(()=>"input"===o()),d=V(()=>"a"===o()&&null!=t?.getAttribute("href"));return O(Ht,i({as:"button",ref(e){const r=He(e=>t=e,n.ref);"function"==typeof r&&r(e)},get type(){return a()||l()?n.type:void 0},get role(){return a()||d()?void 0:"button"},get tabIndex(){return a()||d()||n.disabled?void 0:0},get disabled(){return a()||l()?n.disabled:void 0},get"aria-disabled"(){return!(a()||l()||!n.disabled)||void 0},get"data-disabled"(){return n.disabled?"":void 0}},r))}var Hn=Un,Vn=["top","right","bottom","left"],jn=Math.min,Nn=Math.max,Wn=Math.round,Qn=Math.floor,_n=e=>({x:e,y:e}),Xn={left:"right",right:"left",bottom:"top",top:"bottom"},Zn={start:"end",end:"start"};function Yn(e,t,n){return Nn(e,jn(t,n))}function Jn(e,t){return"function"==typeof e?e(t):e}function er(e){return e.split("-")[0]}function tr(e){return e.split("-")[1]}function nr(e){return"x"===e?"y":"x"}function rr(e){return"y"===e?"height":"width"}function or(e){return["top","bottom"].includes(er(e))?"y":"x"}function ir(e){return nr(or(e))}function sr(e){return e.replace(/start|end/g,e=>Zn[e])}function ar(e){return e.replace(/left|right|bottom|top/g,e=>Xn[e])}function lr(e){return"number"!=typeof e?function(e){return{top:0,right:0,bottom:0,left:0,...e}}(e):{top:e,right:e,bottom:e,left:e}}function dr(e){const{x:t,y:n,width:r,height:o}=e;return{width:r,height:o,top:n,left:t,right:t+r,bottom:n+o,x:t,y:n}}function cr(e,t,n){let{reference:r,floating:o}=e;const i=or(t),s=ir(t),a=rr(s),l=er(t),d="y"===i,c=r.x+r.width/2-o.width/2,u=r.y+r.height/2-o.height/2,g=r[a]/2-o[a]/2;let f;switch(l){case"top":f={x:c,y:r.y-o.height};break;case"bottom":f={x:c,y:r.y+r.height};break;case"right":f={x:r.x+r.width,y:u};break;case"left":f={x:r.x-o.width,y:u};break;default:f={x:r.x,y:r.y}}switch(tr(t)){case"start":f[s]-=g*(n&&d?-1:1);break;case"end":f[s]+=g*(n&&d?-1:1)}return f}async function ur(e,t){var n;void 0===t&&(t={});const{x:r,y:o,platform:i,rects:s,elements:a,strategy:l}=e,{boundary:d="clippingAncestors",rootBoundary:c="viewport",elementContext:u="floating",altBoundary:g=!1,padding:f=0}=Jn(t,e),p=lr(f),h=a[g?"floating"===u?"reference":"floating":u],y=dr(await i.getClippingRect({element:null==(n=await(null==i.isElement?void 0:i.isElement(h)))||n?h:h.contextElement||await(null==i.getDocumentElement?void 0:i.getDocumentElement(a.floating)),boundary:d,rootBoundary:c,strategy:l})),v="floating"===u?{x:r,y:o,width:s.floating.width,height:s.floating.height}:s.reference,m=await(null==i.getOffsetParent?void 0:i.getOffsetParent(a.floating)),b=await(null==i.isElement?void 0:i.isElement(m))&&await(null==i.getScale?void 0:i.getScale(m))||{x:1,y:1},x=dr(i.convertOffsetParentRelativeRectToViewportRelativeRect?await i.convertOffsetParentRelativeRectToViewportRelativeRect({elements:a,rect:v,offsetParent:m,strategy:l}):v);return{top:(y.top-x.top+p.top)/b.y,bottom:(x.bottom-y.bottom+p.bottom)/b.y,left:(y.left-x.left+p.left)/b.x,right:(x.right-y.right+p.right)/b.x}}function gr(e,t){return{top:e.top-t.height,right:e.right-t.width,bottom:e.bottom-t.height,left:e.left-t.width}}function fr(e){return Vn.some(t=>e[t]>=0)}function pr(e){return vr(e)?(e.nodeName||"").toLowerCase():"#document"}function hr(e){var t;return(null==e||null==(t=e.ownerDocument)?void 0:t.defaultView)||window}function yr(e){var t;return null==(t=(vr(e)?e.ownerDocument:e.document)||window.document)?void 0:t.documentElement}function vr(e){return e instanceof Node||e instanceof hr(e).Node}function mr(e){return e instanceof Element||e instanceof hr(e).Element}function br(e){return e instanceof HTMLElement||e instanceof hr(e).HTMLElement}function xr(e){return"undefined"!=typeof ShadowRoot&&(e instanceof ShadowRoot||e instanceof hr(e).ShadowRoot)}function wr(e){const{overflow:t,overflowX:n,overflowY:r,display:o}=qr(e);return/auto|scroll|overlay|hidden|clip/.test(t+r+n)&&!["inline","contents"].includes(o)}function kr(e){return["table","td","th"].includes(pr(e))}function $r(e){return[":popover-open",":modal"].some(t=>{try{return e.matches(t)}catch(n){return!1}})}function Sr(e){const t=Cr(),n=mr(e)?qr(e):e;return"none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!t&&!!n.backdropFilter&&"none"!==n.backdropFilter||!t&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some(e=>(n.willChange||"").includes(e))||["paint","layout","strict","content"].some(e=>(n.contain||"").includes(e))}function Cr(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function Er(e){return["html","body","#document"].includes(pr(e))}function qr(e){return hr(e).getComputedStyle(e)}function Mr(e){return mr(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function Fr(e){if("html"===pr(e))return e;const t=e.assignedSlot||e.parentNode||xr(e)&&e.host||yr(e);return xr(t)?t.host:t}function Lr(e){const t=Fr(e);return Er(t)?e.ownerDocument?e.ownerDocument.body:e.body:br(t)&&wr(t)?t:Lr(t)}function Dr(e,t,n){var r;void 0===t&&(t=[]),void 0===n&&(n=!0);const o=Lr(e),i=o===(null==(r=e.ownerDocument)?void 0:r.body),s=hr(o);return i?t.concat(s,s.visualViewport||[],wr(o)?o:[],s.frameElement&&n?Dr(s.frameElement):[]):t.concat(o,Dr(o,[],n))}function Tr(e){const t=qr(e);let n=parseFloat(t.width)||0,r=parseFloat(t.height)||0;const o=br(e),i=o?e.offsetWidth:n,s=o?e.offsetHeight:r,a=Wn(n)!==i||Wn(r)!==s;return a&&(n=i,r=s),{width:n,height:r,$:a}}function zr(e){return mr(e)?e:e.contextElement}function Ar(e){const t=zr(e);if(!br(t))return _n(1);const n=t.getBoundingClientRect(),{width:r,height:o,$:i}=Tr(t);let s=(i?Wn(n.width):n.width)/r,a=(i?Wn(n.height):n.height)/o;return s&&Number.isFinite(s)||(s=1),a&&Number.isFinite(a)||(a=1),{x:s,y:a}}var Or=_n(0);function Ir(e){const t=hr(e);return Cr()&&t.visualViewport?{x:t.visualViewport.offsetLeft,y:t.visualViewport.offsetTop}:Or}function Pr(e,t,n,r){void 0===t&&(t=!1),void 0===n&&(n=!1);const o=e.getBoundingClientRect(),i=zr(e);let s=_n(1);t&&(r?mr(r)&&(s=Ar(r)):s=Ar(e));const a=function(e,t,n){return void 0===t&&(t=!1),!(!n||t&&n!==hr(e))&&t}(i,n,r)?Ir(i):_n(0);let l=(o.left+a.x)/s.x,d=(o.top+a.y)/s.y,c=o.width/s.x,u=o.height/s.y;if(i){const e=hr(i),t=r&&mr(r)?hr(r):r;let n=e,o=n.frameElement;for(;o&&r&&t!==n;){const e=Ar(o),t=o.getBoundingClientRect(),r=qr(o),i=t.left+(o.clientLeft+parseFloat(r.paddingLeft))*e.x,s=t.top+(o.clientTop+parseFloat(r.paddingTop))*e.y;l*=e.x,d*=e.y,c*=e.x,u*=e.y,l+=i,d+=s,n=hr(o),o=n.frameElement}}return dr({width:c,height:u,x:l,y:d})}function Kr(e){return Pr(yr(e)).left+Mr(e).scrollLeft}function Rr(e,t,n){let r;if("viewport"===t)r=function(e,t){const n=hr(e),r=yr(e),o=n.visualViewport;let i=r.clientWidth,s=r.clientHeight,a=0,l=0;if(o){i=o.width,s=o.height;const e=Cr();(!e||e&&"fixed"===t)&&(a=o.offsetLeft,l=o.offsetTop)}return{width:i,height:s,x:a,y:l}}(e,n);else if("document"===t)r=function(e){const t=yr(e),n=Mr(e),r=e.ownerDocument.body,o=Nn(t.scrollWidth,t.clientWidth,r.scrollWidth,r.clientWidth),i=Nn(t.scrollHeight,t.clientHeight,r.scrollHeight,r.clientHeight);let s=-n.scrollLeft+Kr(e);const a=-n.scrollTop;return"rtl"===qr(r).direction&&(s+=Nn(t.clientWidth,r.clientWidth)-o),{width:o,height:i,x:s,y:a}}(yr(e));else if(mr(t))r=function(e,t){const n=Pr(e,!0,"fixed"===t),r=n.top+e.clientTop,o=n.left+e.clientLeft,i=br(e)?Ar(e):_n(1);return{width:e.clientWidth*i.x,height:e.clientHeight*i.y,x:o*i.x,y:r*i.y}}(t,n);else{const n=Ir(e);r={...t,x:t.x-n.x,y:t.y-n.y}}return dr(r)}function Br(e,t){const n=Fr(e);return!(n===t||!mr(n)||Er(n))&&("fixed"===qr(n).position||Br(n,t))}function Gr(e,t){const n=t.get(e);if(n)return n;let r=Dr(e,[],!1).filter(e=>mr(e)&&"body"!==pr(e)),o=null;const i="fixed"===qr(e).position;let s=i?Fr(e):e;for(;mr(s)&&!Er(s);){const t=qr(s),n=Sr(s);n||"fixed"!==t.position||(o=null),(i?!n&&!o:!n&&"static"===t.position&&o&&["absolute","fixed"].includes(o.position)||wr(s)&&!n&&Br(e,s))?r=r.filter(e=>e!==s):o=t,s=Fr(s)}return t.set(e,r),r}function Ur(e,t,n){const r=br(t),o=yr(t),i="fixed"===n,s=Pr(e,!0,i,t);let a={scrollLeft:0,scrollTop:0};const l=_n(0);if(r||!r&&!i)if(("body"!==pr(t)||wr(o))&&(a=Mr(t)),r){const e=Pr(t,!0,i,t);l.x=e.x+t.clientLeft,l.y=e.y+t.clientTop}else o&&(l.x=Kr(o));return{x:s.left+a.scrollLeft-l.x,y:s.top+a.scrollTop-l.y,width:s.width,height:s.height}}function Hr(e){return"static"===qr(e).position}function Vr(e,t){return br(e)&&"fixed"!==qr(e).position?t?t(e):e.offsetParent:null}function jr(e,t){const n=hr(e);if($r(e))return n;if(!br(e)){let t=Fr(e);for(;t&&!Er(t);){if(mr(t)&&!Hr(t))return t;t=Fr(t)}return n}let r=Vr(e,t);for(;r&&kr(r)&&Hr(r);)r=Vr(r,t);return r&&Er(r)&&Hr(r)&&!Sr(r)?n:r||function(e){let t=Fr(e);for(;br(t)&&!Er(t);){if(Sr(t))return t;if($r(t))return null;t=Fr(t)}return null}(e)||n}var Nr={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){let{elements:t,rect:n,offsetParent:r,strategy:o}=e;const i="fixed"===o,s=yr(r),a=!!t&&$r(t.floating);if(r===s||a&&i)return n;let l={scrollLeft:0,scrollTop:0},d=_n(1);const c=_n(0),u=br(r);if((u||!u&&!i)&&(("body"!==pr(r)||wr(s))&&(l=Mr(r)),br(r))){const e=Pr(r);d=Ar(r),c.x=e.x+r.clientLeft,c.y=e.y+r.clientTop}return{width:n.width*d.x,height:n.height*d.y,x:n.x*d.x-l.scrollLeft*d.x+c.x,y:n.y*d.y-l.scrollTop*d.y+c.y}},getDocumentElement:yr,getClippingRect:function(e){let{element:t,boundary:n,rootBoundary:r,strategy:o}=e;const i=[..."clippingAncestors"===n?$r(t)?[]:Gr(t,this._c):[].concat(n),r],s=i[0],a=i.reduce((e,n)=>{const r=Rr(t,n,o);return e.top=Nn(r.top,e.top),e.right=jn(r.right,e.right),e.bottom=jn(r.bottom,e.bottom),e.left=Nn(r.left,e.left),e},Rr(t,s,o));return{width:a.right-a.left,height:a.bottom-a.top,x:a.left,y:a.top}},getOffsetParent:jr,getElementRects:async function(e){const t=this.getOffsetParent||jr,n=this.getDimensions,r=await n(e.floating);return{reference:Ur(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:r.width,height:r.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){const{width:t,height:n}=Tr(e);return{width:t,height:n}},getScale:Ar,isElement:mr,isRTL:function(e){return"rtl"===qr(e).direction}};function Wr(e,t,n,r){void 0===r&&(r={});const{ancestorScroll:o=!0,ancestorResize:i=!0,elementResize:s="function"==typeof ResizeObserver,layoutShift:a="function"==typeof IntersectionObserver,animationFrame:l=!1}=r,d=zr(e),c=o||i?[...d?Dr(d):[],...Dr(t)]:[];c.forEach(e=>{o&&e.addEventListener("scroll",n,{passive:!0}),i&&e.addEventListener("resize",n)});const u=d&&a?function(e,t){let n,r=null;const o=yr(e);function i(){var e;clearTimeout(n),null==(e=r)||e.disconnect(),r=null}return function s(a,l){void 0===a&&(a=!1),void 0===l&&(l=1),i();const{left:d,top:c,width:u,height:g}=e.getBoundingClientRect();if(a||t(),!u||!g)return;const f={rootMargin:-Qn(c)+"px "+-Qn(o.clientWidth-(d+u))+"px "+-Qn(o.clientHeight-(c+g))+"px "+-Qn(d)+"px",threshold:Nn(0,jn(1,l))||1};let p=!0;function h(e){const t=e[0].intersectionRatio;if(t!==l){if(!p)return s();t?s(!1,t):n=setTimeout(()=>{s(!1,1e-7)},1e3)}p=!1}try{r=new IntersectionObserver(h,{...f,root:o.ownerDocument})}catch(y){r=new IntersectionObserver(h,f)}r.observe(e)}(!0),i}(d,n):null;let g,f=-1,p=null;s&&(p=new ResizeObserver(e=>{let[r]=e;r&&r.target===d&&p&&(p.unobserve(t),cancelAnimationFrame(f),f=requestAnimationFrame(()=>{var e;null==(e=p)||e.observe(t)})),n()}),d&&!l&&p.observe(d),p.observe(t));let h=l?Pr(e):null;return l&&function t(){const r=Pr(e);!h||r.x===h.x&&r.y===h.y&&r.width===h.width&&r.height===h.height||n();h=r,g=requestAnimationFrame(t)}(),n(),()=>{var e;c.forEach(e=>{o&&e.removeEventListener("scroll",n),i&&e.removeEventListener("resize",n)}),u?.(),null==(e=p)||e.disconnect(),p=null,l&&cancelAnimationFrame(g)}}var Qr=function(e){return void 0===e&&(e=0),{name:"offset",options:e,async fn(t){var n,r;const{x:o,y:i,placement:s,middlewareData:a}=t,l=await async function(e,t){const{placement:n,platform:r,elements:o}=e,i=await(null==r.isRTL?void 0:r.isRTL(o.floating)),s=er(n),a=tr(n),l="y"===or(n),d=["left","top"].includes(s)?-1:1,c=i&&l?-1:1,u=Jn(t,e);let{mainAxis:g,crossAxis:f,alignmentAxis:p}="number"==typeof u?{mainAxis:u,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...u};return a&&"number"==typeof p&&(f="end"===a?-1*p:p),l?{x:f*c,y:g*d}:{x:g*d,y:f*c}}(t,e);return s===(null==(n=a.offset)?void 0:n.placement)&&null!=(r=a.arrow)&&r.alignmentOffset?{}:{x:o+l.x,y:i+l.y,data:{...l,placement:s}}}}},_r=function(e){return void 0===e&&(e={}),{name:"shift",options:e,async fn(t){const{x:n,y:r,placement:o}=t,{mainAxis:i=!0,crossAxis:s=!1,limiter:a={fn:e=>{let{x:t,y:n}=e;return{x:t,y:n}}},...l}=Jn(e,t),d={x:n,y:r},c=await ur(t,l),u=or(er(o)),g=nr(u);let f=d[g],p=d[u];if(i){const e="y"===g?"bottom":"right";f=Yn(f+c["y"===g?"top":"left"],f,f-c[e])}if(s){const e="y"===u?"bottom":"right";p=Yn(p+c["y"===u?"top":"left"],p,p-c[e])}const h=a.fn({...t,[g]:f,[u]:p});return{...h,data:{x:h.x-n,y:h.y-r}}}}},Xr=function(e){return void 0===e&&(e={}),{name:"flip",options:e,async fn(t){var n,r;const{placement:o,middlewareData:i,rects:s,initialPlacement:a,platform:l,elements:d}=t,{mainAxis:c=!0,crossAxis:u=!0,fallbackPlacements:g,fallbackStrategy:f="bestFit",fallbackAxisSideDirection:p="none",flipAlignment:h=!0,...y}=Jn(e,t);if(null!=(n=i.arrow)&&n.alignmentOffset)return{};const v=er(o),m=or(a),b=er(a)===a,x=await(null==l.isRTL?void 0:l.isRTL(d.floating)),w=g||(b||!h?[ar(a)]:function(e){const t=ar(e);return[sr(e),t,sr(t)]}(a)),k="none"!==p;!g&&k&&w.push(...function(e,t,n,r){const o=tr(e);let i=function(e,t,n){const r=["left","right"],o=["right","left"],i=["top","bottom"],s=["bottom","top"];switch(e){case"top":case"bottom":return n?t?o:r:t?r:o;case"left":case"right":return t?i:s;default:return[]}}(er(e),"start"===n,r);return o&&(i=i.map(e=>e+"-"+o),t&&(i=i.concat(i.map(sr)))),i}(a,h,p,x));const $=[a,...w],S=await ur(t,y),C=[];let E=(null==(r=i.flip)?void 0:r.overflows)||[];if(c&&C.push(S[v]),u){const e=function(e,t,n){void 0===n&&(n=!1);const r=tr(e),o=ir(e),i=rr(o);let s="x"===o?r===(n?"end":"start")?"right":"left":"start"===r?"bottom":"top";return t.reference[i]>t.floating[i]&&(s=ar(s)),[s,ar(s)]}(o,s,x);C.push(S[e[0]],S[e[1]])}if(E=[...E,{placement:o,overflows:C}],!C.every(e=>e<=0)){var q,M;const e=((null==(q=i.flip)?void 0:q.index)||0)+1,t=$[e];if(t)return{data:{index:e,overflows:E},reset:{placement:t}};let n=null==(M=E.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:M.placement;if(!n)switch(f){case"bestFit":{var F;const e=null==(F=E.filter(e=>{if(k){const t=or(e.placement);return t===m||"y"===t}return!0}).map(e=>[e.placement,e.overflows.filter(e=>e>0).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:F[0];e&&(n=e);break}case"initialPlacement":n=a}if(o!==n)return{reset:{placement:n}}}return{}}}},Zr=function(e){return void 0===e&&(e={}),{name:"size",options:e,async fn(t){const{placement:n,rects:r,platform:o,elements:i}=t,{apply:s=()=>{},...a}=Jn(e,t),l=await ur(t,a),d=er(n),c=tr(n),u="y"===or(n),{width:g,height:f}=r.floating;let p,h;"top"===d||"bottom"===d?(p=d,h=c===(await(null==o.isRTL?void 0:o.isRTL(i.floating))?"start":"end")?"left":"right"):(h=d,p="end"===c?"top":"bottom");const y=f-l.top-l.bottom,v=g-l.left-l.right,m=jn(f-l[p],y),b=jn(g-l[h],v),x=!t.middlewareData.shift;let w=m,k=b;if(u?k=c||x?jn(b,v):v:w=c||x?jn(m,y):y,x&&!c){const e=Nn(l.left,0),t=Nn(l.right,0),n=Nn(l.top,0),r=Nn(l.bottom,0);u?k=g-2*(0!==e||0!==t?e+t:Nn(l.left,l.right)):w=f-2*(0!==n||0!==r?n+r:Nn(l.top,l.bottom))}await s({...t,availableWidth:k,availableHeight:w});const $=await o.getDimensions(i.floating);return g!==$.width||f!==$.height?{reset:{rects:!0}}:{}}}},Yr=function(e){return void 0===e&&(e={}),{name:"hide",options:e,async fn(t){const{rects:n}=t,{strategy:r="referenceHidden",...o}=Jn(e,t);switch(r){case"referenceHidden":{const e=gr(await ur(t,{...o,elementContext:"reference"}),n.reference);return{data:{referenceHiddenOffsets:e,referenceHidden:fr(e)}}}case"escaped":{const e=gr(await ur(t,{...o,altBoundary:!0}),n.floating);return{data:{escapedOffsets:e,escaped:fr(e)}}}default:return{}}}}},Jr=e=>({name:"arrow",options:e,async fn(t){const{x:n,y:r,placement:o,rects:i,platform:s,elements:a,middlewareData:l}=t,{element:d,padding:c=0}=Jn(e,t)||{};if(null==d)return{};const u=lr(c),g={x:n,y:r},f=ir(o),p=rr(f),h=await s.getDimensions(d),y="y"===f,v=y?"top":"left",m=y?"bottom":"right",b=y?"clientHeight":"clientWidth",x=i.reference[p]+i.reference[f]-g[f]-i.floating[p],w=g[f]-i.reference[f],k=await(null==s.getOffsetParent?void 0:s.getOffsetParent(d));let $=k?k[b]:0;$&&await(null==s.isElement?void 0:s.isElement(k))||($=a.floating[b]||i.floating[p]);const S=x/2-w/2,C=$/2-h[p]/2-1,E=jn(u[v],C),q=jn(u[m],C),M=E,F=$-h[p]-q,L=$/2-h[p]/2+S,D=Yn(M,L,F),T=!l.arrow&&null!=tr(o)&&L!==D&&i.reference[p]/2-(L<M?E:q)-h[p]/2<0,z=T?L<M?L-M:L-F:0;return{[f]:g[f]+z,data:{[f]:D,centerOffset:L-D-z,...T&&{alignmentOffset:z}},reset:T}}}),eo=(e,t,n)=>{const r=new Map,o={platform:Nr,...n},i={...o.platform,_c:r};return(async(e,t,n)=>{const{placement:r="bottom",strategy:o="absolute",middleware:i=[],platform:s}=n,a=i.filter(Boolean),l=await(null==s.isRTL?void 0:s.isRTL(t));let d=await s.getElementRects({reference:e,floating:t,strategy:o}),{x:c,y:u}=cr(d,r,l),g=r,f={},p=0;for(let h=0;h<a.length;h++){const{name:n,fn:i}=a[h],{x:y,y:v,data:m,reset:b}=await i({x:c,y:u,initialPlacement:r,placement:g,strategy:o,middlewareData:f,rects:d,platform:s,elements:{reference:e,floating:t}});c=null!=y?y:c,u=null!=v?v:u,f={...f,[n]:{...f[n],...m}},b&&p<=50&&(p++,"object"==typeof b&&(b.placement&&(g=b.placement),b.rects&&(d=!0===b.rects?await s.getElementRects({reference:e,floating:t,strategy:o}):b.rects),({x:c,y:u}=cr(d,g,l))),h=-1)}return{x:c,y:u,placement:g,strategy:o,middlewareData:f}})(e,t,{...o,platform:i})},to=F();function no(){const e=p(to);if(void 0===e)throw new Error("[kobalte]: `usePopperContext` must be used within a `Popper` component");return e}var ro=d('<svg display="block" viewBox="0 0 30 30" style="transform:scale(1.02)"><g><path fill="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z"></path><path stroke="none" d="M23,27.8c1.1,1.2,3.4,2.2,5,2.2h2H0h2c1.7,0,3.9-1,5-2.2l6.6-7.2c0.7-0.8,2-0.8,2.7,0L23,27.8L23,27.8z">'),oo={top:180,right:-90,bottom:0,left:90};function io(e){const t=no(),[n,r]=s(zt({size:30},e),["ref","style","size"]),o=()=>t.currentPlacement().split("-")[0],l=function(e){const[t,n]=N();return $(()=>{const t=e();var r;t&&n((r=t,ut(r).defaultView||window).getComputedStyle(t))}),t}(t.contentRef),d=()=>2*Number.parseInt(l()?.getPropertyValue(`border-${o()}-width`)||"0px")*(30/n.size);return O(Ht,i({as:"div",ref(e){const r=He(t.setArrowRef,n.ref);"function"==typeof r&&r(e)},"aria-hidden":"true",get style(){return ot({position:"absolute","font-size":`${n.size}px`,width:"1em",height:"1em","pointer-events":"none",fill:l()?.getPropertyValue("background-color")||"none",stroke:l()?.getPropertyValue(`border-${o()}-color`)||"none","stroke-width":d()},n.style)}},r,{get children(){const e=ro(),t=e.firstChild;return W(()=>a(t,"transform",`rotate(${oo[o()]} 15 15) translate(0 2)`)),e}}))}function so(e){const{x:t=0,y:n=0,width:r=0,height:o=0}=e??{};if("function"==typeof DOMRect)return new DOMRect(t,n,r,o);const i={x:t,y:n,width:r,height:o,top:n,right:t+r,bottom:n+o,left:t};return{...i,toJSON:()=>i}}function ao(e){return/^(?:top|bottom|left|right)(?:-(?:start|end))?$/.test(e)}var lo={top:"bottom",right:"left",bottom:"top",left:"right"};var co=Object.assign(function(e){const t=zt({getAnchorRect:e=>e?.getBoundingClientRect(),placement:"bottom",gutter:0,shift:0,flip:!0,slide:!0,overlap:!1,sameWidth:!1,fitViewport:!1,hideWhenDetached:!1,detachedPadding:0,arrowPadding:4,overflowPadding:8},e),[n,r]=N(),[o,i]=N(),[s,a]=N(t.placement),l=()=>{return e=t.anchorRef?.(),n=t.getAnchorRect,{contextElement:e,getBoundingClientRect:()=>{const t=n(e);return t?so(t):e?e.getBoundingClientRect():so()}};var e,n},{direction:d}=bn();async function c(){const e=l(),r=n(),i=o();if(!e||!r)return;const s=(i?.clientHeight||0)/2,c="number"==typeof t.gutter?t.gutter+s:t.gutter??s;r.style.setProperty("--kb-popper-content-overflow-padding",`${t.overflowPadding}px`),e.getBoundingClientRect();const u=[Qr(({placement:e})=>{const n=!!e.split("-")[1];return{mainAxis:c,crossAxis:n?void 0:t.shift,alignmentAxis:t.shift}})];if(!1!==t.flip){const e="string"==typeof t.flip?t.flip.split(" "):void 0;if(void 0!==e&&!e.every(ao))throw new Error("`flip` expects a spaced-delimited list of placements");u.push(Xr({padding:t.overflowPadding,fallbackPlacements:e}))}(t.slide||t.overlap)&&u.push(_r({mainAxis:t.slide,crossAxis:t.overlap,padding:t.overflowPadding})),u.push(Zr({padding:t.overflowPadding,apply({availableWidth:e,availableHeight:n,rects:o}){const i=Math.round(o.reference.width);e=Math.floor(e),n=Math.floor(n),r.style.setProperty("--kb-popper-anchor-width",`${i}px`),r.style.setProperty("--kb-popper-content-available-width",`${e}px`),r.style.setProperty("--kb-popper-content-available-height",`${n}px`),t.sameWidth&&(r.style.width=`${i}px`),t.fitViewport&&(r.style.maxWidth=`${e}px`,r.style.maxHeight=`${n}px`)}})),t.hideWhenDetached&&u.push(Yr({padding:t.detachedPadding})),i&&u.push(Jr({element:i,padding:t.arrowPadding}));const g=await eo(e,r,{placement:t.placement,strategy:"absolute",middleware:u,platform:{...Nr,isRTL:()=>"rtl"===d()}});if(a(g.placement),t.onCurrentPlacementChange?.(g.placement),!r)return;r.style.setProperty("--kb-popper-content-transform-origin",function(e,t){const[n,r]=e.split("-"),o=lo[n];return r?"left"===n||"right"===n?`${o} ${"start"===r?"top":"bottom"}`:"start"===r?`${o} ${"rtl"===t?"right":"left"}`:`${o} ${"rtl"===t?"left":"right"}`:`${o} center`}(g.placement,d()));const f=Math.round(g.x),p=Math.round(g.y);let h;if(t.hideWhenDetached&&(h=g.middlewareData.hide?.referenceHidden?"hidden":"visible"),Object.assign(r.style,{top:"0",left:"0",transform:`translate3d(${f}px, ${p}px, 0)`,visibility:h}),i&&g.middlewareData.arrow){const{x:e,y:t}=g.middlewareData.arrow,n=g.placement.split("-")[0];Object.assign(i.style,{left:null!=e?`${e}px`:"",top:null!=t?`${t}px`:"",[n]:"100%"})}}$(()=>{const e=l(),t=n();e&&t&&h(Wr(e,t,c,{elementResize:"function"==typeof ResizeObserver}))}),$(()=>{const e=n(),r=t.contentRef?.();e&&r&&queueMicrotask(()=>{e.style.zIndex=getComputedStyle(r).zIndex})});const u={currentPlacement:s,contentRef:()=>t.contentRef?.(),setPositionerRef:r,setArrowRef:i};return O(to.Provider,{value:u,get children(){return t.children}})},{Arrow:io,Context:to,usePopperContext:no,Positioner:function(e){const t=no(),[n,r]=s(e,["ref","style"]);return O(Ht,i({as:"div",ref(e){const r=He(t.setPositionerRef,n.ref);"function"==typeof r&&r(e)},"data-popper-positioner":"",get style(){return ot({position:"absolute",top:0,left:0,"min-width":"max-content"},n.style)}},r))}});var uo="interactOutside.pointerDownOutside",go="interactOutside.focusOutside";var fo=F();function po(e){let t;const n=p(fo),[r,o]=s(e,["ref","disableOutsidePointerEvents","excludedElements","onEscapeKeyDown","onPointerDownOutside","onFocusOutside","onInteractOutside","onDismiss","bypassTopMostLayerCheck"]),a=new Set([]);!function(e,t){let n,r=Tt;const o=()=>ut(t()),i=t=>e.onPointerDownOutside?.(t),s=t=>e.onFocusOutside?.(t),a=t=>e.onInteractOutside?.(t),l=n=>{const r=n.target;return r instanceof HTMLElement&&!r.closest(`[${zn}]`)&&!!dt(o(),r)&&!dt(t(),r)&&!e.shouldExcludeElement?.(r)},d=e=>{function n(){const n=t(),r=e.target;if(!n||!r||!l(e))return;const o=mt([i,a]);r.addEventListener(uo,o,{once:!0});const s=new CustomEvent(uo,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:2===e.button||bt(e)&&0===e.button}});r.dispatchEvent(s)}"touch"===e.pointerType?(o().removeEventListener("click",n),r=n,o().addEventListener("click",n,{once:!0})):n()},c=e=>{const n=t(),r=e.target;if(!n||!r||!l(e))return;const o=mt([s,a]);r.addEventListener(go,o,{once:!0});const i=new CustomEvent(go,{bubbles:!1,cancelable:!0,detail:{originalEvent:e,isContextMenu:!1}});r.dispatchEvent(i)};$(()=>{X(e.isDisabled)||(n=window.setTimeout(()=>{o().addEventListener("pointerdown",d,!0)},0),o().addEventListener("focusin",c,!0),h(()=>{window.clearTimeout(n),o().removeEventListener("click",r),o().removeEventListener("pointerdown",d,!0),o().removeEventListener("focusin",c,!0)}))})}({shouldExcludeElement:e=>!!t&&(r.excludedElements?.some(t=>dt(t(),e))||[...a].some(t=>dt(t,e))),onPointerDownOutside:e=>{t&&!Bn.isBelowPointerBlockingLayer(t)&&(r.bypassTopMostLayerCheck||Bn.isTopMostLayer(t))&&(r.onPointerDownOutside?.(e),r.onInteractOutside?.(e),e.defaultPrevented||r.onDismiss?.())},onFocusOutside:e=>{r.onFocusOutside?.(e),r.onInteractOutside?.(e),e.defaultPrevented||r.onDismiss?.()}},()=>t),function(e){const t=t=>{t.key===ft.Escape&&e.onEscapeKeyDown?.(t)};$(()=>{if(X(e.isDisabled))return;const n=e.ownerDocument?.()??ut();n.addEventListener("keydown",t),h(()=>{n.removeEventListener("keydown",t)})})}({ownerDocument:()=>ut(t),onEscapeKeyDown:e=>{t&&Bn.isTopMostLayer(t)&&(r.onEscapeKeyDown?.(e),!e.defaultPrevented&&r.onDismiss&&(e.preventDefault(),r.onDismiss()))}}),Q(()=>{if(!t)return;Bn.addLayer({node:t,isPointerBlocking:r.disableOutsidePointerEvents,dismiss:r.onDismiss});const e=n?.registerNestedLayer(t);Bn.assignPointerEventToLayers(),Bn.disableBodyPointerEvents(t),h(()=>{t&&(Bn.removeLayer(t),e?.(),Bn.assignPointerEventToLayers(),Bn.restoreBodyPointerEvents(t))})}),$(u([()=>t,()=>r.disableOutsidePointerEvents],([e,t])=>{if(!e)return;const n=Bn.find(e);n&&n.isPointerBlocking!==t&&(n.isPointerBlocking=t,Bn.assignPointerEventToLayers()),t&&Bn.disableBodyPointerEvents(e),h(()=>{Bn.restoreBodyPointerEvents(e)})},{defer:!0}));const l={registerNestedLayer:e=>{a.add(e);const t=n?.registerNestedLayer(e);return()=>{a.delete(e),t?.()}}};return O(fo.Provider,{value:l,get children(){return O(Ht,i({as:"div",ref(e){const n=He(e=>t=e,r.ref);"function"==typeof n&&n(e)}},o))}})}function ho(e={}){const[t,n]=Yt({value:()=>X(e.open),defaultValue:()=>!!X(e.defaultOpen),onChange:t=>e.onOpenChange?.(t)}),r=()=>{n(!0)},o=()=>{n(!1)};return{isOpen:t,setIsOpen:n,open:r,close:o,toggle:()=>{t()?o():r()}}}var yo={};en(yo,{Description:()=>Wt,ErrorMessage:()=>Qt,Item:()=>wo,ItemControl:()=>ko,ItemDescription:()=>$o,ItemIndicator:()=>So,ItemInput:()=>Co,ItemLabel:()=>Eo,Label:()=>qo,RadioGroup:()=>Fo,Root:()=>Mo});var vo=F();function mo(){const e=p(vo);if(void 0===e)throw new Error("[kobalte]: `useRadioGroupContext` must be used within a `RadioGroup` component");return e}var bo=F();function xo(){const e=p(bo);if(void 0===e)throw new Error("[kobalte]: `useRadioGroupItemContext` must be used within a `RadioGroup.Item` component");return e}function wo(e){const t=Nt(),n=mo(),[r,o]=s(zt({id:`${t.generateId("item")}-${y()}`},e),["value","disabled","onPointerDown"]),[a,l]=N(),[d,c]=N(),[u,g]=N(),[f,p]=N(),[h,v]=N(!1),m=V(()=>n.isSelectedValue(r.value)),b=V(()=>r.disabled||t.isDisabled()||!1),x=e=>{vt(e,r.onPointerDown),h()&&e.preventDefault()},w=V(()=>({...t.dataset(),"data-disabled":b()?"":void 0,"data-checked":m()?"":void 0})),k={value:()=>r.value,dataset:w,isSelected:m,isDisabled:b,inputId:a,labelId:d,descriptionId:u,inputRef:f,select:()=>n.setSelectedValue(r.value),generateId:lt(()=>o.id),registerInput:Bt(l),registerLabel:Bt(c),registerDescription:Bt(g),setIsFocused:v,setInputRef:p};return O(bo.Provider,{value:k,get children(){return O(Ht,i({as:"div",role:"group",onPointerDown:x},w,o))}})}function ko(e){const t=xo(),[n,r]=s(zt({id:t.generateId("control")},e),["onClick","onKeyDown"]);return O(Ht,i({as:"div",onClick:e=>{vt(e,n.onClick),t.select(),t.inputRef()?.focus()},onKeyDown:e=>{vt(e,n.onKeyDown),e.key===ft.Space&&(t.select(),t.inputRef()?.focus())}},()=>t.dataset(),r))}function $o(e){const t=xo(),n=zt({id:t.generateId("description")},e);return $(()=>h(t.registerDescription(n.id))),O(Ht,i({as:"div"},()=>t.dataset(),n))}function So(e){const t=xo(),[n,r]=s(zt({id:t.generateId("indicator")},e),["ref","forceMount"]),[o,a]=N(),{present:l}=Tn({show:()=>n.forceMount||t.isSelected(),element:()=>o()??null});return O(G,{get when(){return l()},get children(){return O(Ht,i({as:"div",ref(e){const t=He(a,n.ref);"function"==typeof t&&t(e)}},()=>t.dataset(),r))}})}function Co(e){const t=Nt(),n=mo(),r=xo(),[o,a]=s(zt({id:r.generateId("input")},e),["ref","style","aria-labelledby","aria-describedby","onChange","onFocus","onBlur"]),[l,d]=N(!1);return $(u([()=>r.isSelected(),()=>r.value()],e=>{if(!e[0]&&e[1]===r.value())return;d(!0);const t=r.inputRef();t?.dispatchEvent(new Event("input",{bubbles:!0,cancelable:!0})),t?.dispatchEvent(new Event("change",{bubbles:!0,cancelable:!0}))},{defer:!0})),$(()=>h(r.registerInput(a.id))),O(Ht,i({as:"input",ref(e){const t=He(r.setInputRef,o.ref);"function"==typeof t&&t(e)},type:"radio",get name(){return t.name()},get value(){return r.value()},get checked(){return r.isSelected()},get required(){return t.isRequired()},get disabled(){return r.isDisabled()},get readonly(){return t.isReadOnly()},get style(){return ot({...Rt},o.style)},get"aria-labelledby"(){return[o["aria-labelledby"],r.labelId(),null!=o["aria-labelledby"]&&null!=a["aria-label"]?a.id:void 0].filter(Boolean).join(" ")||void 0},get"aria-describedby"(){return[o["aria-describedby"],r.descriptionId(),n.ariaDescribedBy()].filter(Boolean).join(" ")||void 0},onChange:e=>{if(vt(e,o.onChange),e.stopPropagation(),!l()){n.setSelectedValue(r.value());e.target.checked=r.isSelected()}d(!1)},onFocus:e=>{vt(e,o.onFocus),r.setIsFocused(!0)},onBlur:e=>{vt(e,o.onBlur),r.setIsFocused(!1)}},()=>r.dataset(),a))}function Eo(e){const t=xo(),n=zt({id:t.generateId("label")},e);return $(()=>h(t.registerLabel(n.id))),O(Ht,i({as:"label",get for(){return t.inputId()}},()=>t.dataset(),n))}function qo(e){return O(_t,i({as:"span"},e))}function Mo(e){let t;const[n,r,o]=s(zt({id:`radiogroup-${y()}`,orientation:"vertical"},e),["ref","value","defaultValue","onChange","orientation","aria-labelledby","aria-describedby"],Vt),[a,l]=Zt({value:()=>n.value,defaultValue:()=>n.defaultValue,onChange:e=>n.onChange?.(e)}),{formControlContext:d}=function(e){const t=zt({id:`form-control-${y()}`},e),[n,r]=N(),[o,i]=N(),[s,a]=N(),[l,d]=N();return{formControlContext:{name:()=>X(t.name)??X(t.id),dataset:V(()=>({"data-valid":"valid"===X(t.validationState)?"":void 0,"data-invalid":"invalid"===X(t.validationState)?"":void 0,"data-required":X(t.required)?"":void 0,"data-disabled":X(t.disabled)?"":void 0,"data-readonly":X(t.readOnly)?"":void 0})),validationState:()=>X(t.validationState),isRequired:()=>X(t.required),isDisabled:()=>X(t.disabled),isReadOnly:()=>X(t.readOnly),labelId:n,fieldId:o,descriptionId:s,errorMessageId:l,getAriaLabelledBy:(e,t,r)=>{const o=null!=r||null!=n();return[r,n(),o&&null!=t?e:void 0].filter(Boolean).join(" ")||void 0},getAriaDescribedBy:e=>[s(),l(),e].filter(Boolean).join(" ")||void 0,generateId:lt(()=>X(t.id)),registerLabel:Bt(r),registerField:Bt(i),registerDescription:Bt(a),registerErrorMessage:Bt(d)}}}(r);Xt(()=>t,()=>l(n.defaultValue??""));const c=()=>d.getAriaDescribedBy(n["aria-describedby"]),u=e=>e===a(),g={ariaDescribedBy:c,isSelectedValue:u,setSelectedValue:e=>{if(!d.isReadOnly()&&!d.isDisabled()&&(l(e),t))for(const n of t.querySelectorAll("[type='radio']")){const e=n;e.checked=u(e.value)}}};return O(jt.Provider,{value:d,get children(){return O(vo.Provider,{value:g,get children(){return O(Ht,i({as:"div",ref(e){const r=He(e=>t=e,n.ref);"function"==typeof r&&r(e)},role:"radiogroup",get id(){return X(r.id)},get"aria-invalid"(){return"invalid"===d.validationState()||void 0},get"aria-required"(){return d.isRequired()||void 0},get"aria-disabled"(){return d.isDisabled()||void 0},get"aria-readonly"(){return d.isReadOnly()||void 0},get"aria-orientation"(){return n.orientation},get"aria-labelledby"(){return d.getAriaLabelledBy(X(r.id),o["aria-label"],n["aria-labelledby"])},get"aria-describedby"(){return c()}},()=>d.dataset(),o))}})}})}var Fo=Object.assign(Mo,{Description:Wt,ErrorMessage:Qt,Item:wo,ItemControl:ko,ItemDescription:$o,ItemIndicator:So,ItemInput:Co,ItemLabel:Eo,Label:qo}),Lo=class{collection;ref;collator;constructor(e,t,n){this.collection=e,this.ref=t,this.collator=n}getKeyBelow(e){let t=this.collection().getKeyAfter(e);for(;null!=t;){const e=this.collection().getItem(t);if(e&&"item"===e.type&&!e.disabled)return t;t=this.collection().getKeyAfter(t)}}getKeyAbove(e){let t=this.collection().getKeyBefore(e);for(;null!=t;){const e=this.collection().getItem(t);if(e&&"item"===e.type&&!e.disabled)return t;t=this.collection().getKeyBefore(t)}}getFirstKey(){let e=this.collection().getFirstKey();for(;null!=e;){const t=this.collection().getItem(e);if(t&&"item"===t.type&&!t.disabled)return e;e=this.collection().getKeyAfter(e)}}getLastKey(){let e=this.collection().getLastKey();for(;null!=e;){const t=this.collection().getItem(e);if(t&&"item"===t.type&&!t.disabled)return e;e=this.collection().getKeyBefore(e)}}getItem(e){return this.ref?.()?.querySelector(`[data-key="${e}"]`)??null}getKeyPageAbove(e){const t=this.ref?.();let n=this.getItem(e);if(!t||!n)return;const r=Math.max(0,n.offsetTop+n.offsetHeight-t.offsetHeight);let o=e;for(;o&&n&&n.offsetTop>r;)o=this.getKeyAbove(o),n=null!=o?this.getItem(o):null;return o}getKeyPageBelow(e){const t=this.ref?.();let n=this.getItem(e);if(!t||!n)return;const r=Math.min(t.scrollHeight,n.offsetTop-n.offsetHeight+t.offsetHeight);let o=e;for(;o&&n&&n.offsetTop<r;)o=this.getKeyBelow(o),n=null!=o?this.getItem(o):null;return o}getKeyForSearch(e,t){const n=this.collator?.();if(!n)return;let r=null!=t?this.getKeyBelow(t):this.getFirstKey();for(;null!=r;){const t=this.collection().getItem(r);if(t){const o=t.textValue.slice(0,e.length);if(t.textValue&&0===n.compare(o,e))return r}r=this.getKeyBelow(r)}}};function Do(e,t,n){const r=function(e){const{locale:t}=bn(),n=V(()=>t()+(e?Object.entries(e).sort((e,t)=>e[0]<t[0]?-1:1).join():""));return V(()=>{const r=n();let o;return xn.has(r)&&(o=xn.get(r)),o||(o=new Intl.Collator(t(),e),xn.set(r,o)),o})}({usage:"search",sensitivity:"base"});return En({selectionManager:()=>X(e.selectionManager),keyboardDelegate:V(()=>{const n=X(e.keyboardDelegate);return n||new Lo(e.collection,t,r)}),autoFocus:()=>X(e.autoFocus),deferAutoFocus:()=>X(e.deferAutoFocus),shouldFocusWrap:()=>X(e.shouldFocusWrap),disallowEmptySelection:()=>X(e.disallowEmptySelection),selectOnFocus:()=>X(e.selectOnFocus),disallowTypeAhead:()=>X(e.disallowTypeAhead),shouldUseVirtualFocus:()=>X(e.shouldUseVirtualFocus),allowsTabNavigation:()=>X(e.allowsTabNavigation),isVirtualized:()=>X(e.isVirtualized),scrollToKey:t=>X(e.scrollToKey)?.(t),orientation:()=>X(e.orientation)},t)}var To="focusScope.autoFocusOnMount",zo="focusScope.autoFocusOnUnmount",Ao={bubbles:!1,cancelable:!0},Oo={stack:[],active(){return this.stack[0]},add(e){e!==this.active()&&this.active()?.pause(),this.stack=it(this.stack,e),this.stack.unshift(e)},remove(e){this.stack=it(this.stack,e),this.active()?.resume()}};function Io(e,t){const[n,r]=N(!1),o={pause(){r(!0)},resume(){r(!1)}};let i=null;const s=t=>e.onMountAutoFocus?.(t),a=t=>e.onUnmountAutoFocus?.(t),l=()=>ut(t()),d=()=>{const e=l().createElement("span");return e.setAttribute("data-focus-trap",""),e.tabIndex=0,Object.assign(e.style,Rt),e},c=()=>{const e=t();return e?Et(e,!0).filter(e=>!e.hasAttribute("data-focus-trap")):[]},u=()=>{const e=c();return e.length>0?e[0]:null};$(()=>{const e=t();if(!e)return;Oo.add(o);const n=ct(e);if(!dt(e,n)){const t=new CustomEvent(To,Ao);e.addEventListener(To,s),e.dispatchEvent(t),t.defaultPrevented||setTimeout(()=>{xt(u()),ct(e)===n&&xt(e)},0)}h(()=>{e.removeEventListener(To,s),setTimeout(()=>{const r=new CustomEvent(zo,Ao);(()=>{const e=t();if(!e)return!1;const n=ct(e);return!!n&&!dt(e,n)&&Mt(n)})()&&r.preventDefault(),e.addEventListener(zo,a),e.dispatchEvent(r),r.defaultPrevented||xt(n??l().body),e.removeEventListener(zo,a),Oo.remove(o)},0)})}),$(()=>{const r=t();if(!r||!X(e.trapFocus)||n())return;const o=e=>{const t=e.target;t?.closest(`[${zn}]`)||(dt(r,t)?i=t:xt(i))},s=e=>{const t=e.relatedTarget??ct(r);t?.closest(`[${zn}]`)||dt(r,t)||xt(i)};l().addEventListener("focusin",o),l().addEventListener("focusout",s),h(()=>{l().removeEventListener("focusin",o),l().removeEventListener("focusout",s)})}),$(()=>{const r=t();if(!r||!X(e.trapFocus)||n())return;const o=d();r.insertAdjacentElement("afterbegin",o);const i=d();function s(e){const t=u(),n=(()=>{const e=c();return e.length>0?e[e.length-1]:null})();e.relatedTarget===t?xt(n):xt(t)}r.insertAdjacentElement("beforeend",i),o.addEventListener("focusin",s),i.addEventListener("focusin",s);const a=new MutationObserver(e=>{for(const t of e)t.previousSibling===i&&(i.remove(),r.insertAdjacentElement("beforeend",i)),t.nextSibling===o&&(o.remove(),r.insertAdjacentElement("afterbegin",o))});a.observe(r,{childList:!0,subtree:!1}),h(()=>{o.removeEventListener("focusin",s),i.removeEventListener("focusin",s),o.remove(),i.remove(),a.disconnect()})})}var Po="data-live-announcer";function Ko(e){$(()=>{X(e.isDisabled)||h(function(e,t=document.body){const n=new Set(e),r=new Set,o=e=>{for(const r of e.querySelectorAll(`[${Po}], [${zn}]`))n.add(r);const t=e=>{if(n.has(e)||e.parentElement&&r.has(e.parentElement)&&"row"!==e.parentElement.getAttribute("role"))return NodeFilter.FILTER_REJECT;for(const t of n)if(e.contains(t))return NodeFilter.FILTER_SKIP;return NodeFilter.FILTER_ACCEPT},o=document.createTreeWalker(e,NodeFilter.SHOW_ELEMENT,{acceptNode:t}),s=t(e);if(s===NodeFilter.FILTER_ACCEPT&&i(e),s!==NodeFilter.FILTER_REJECT){let e=o.nextNode();for(;null!=e;)i(e),e=o.nextNode()}},i=e=>{const t=Ro.get(e)??0;"true"===e.getAttribute("aria-hidden")&&0===t||(0===t&&e.setAttribute("aria-hidden","true"),r.add(e),Ro.set(e,t+1))};Bo.length&&Bo[Bo.length-1].disconnect();o(t);const s=new MutationObserver(e=>{for(const t of e)if("childList"===t.type&&0!==t.addedNodes.length&&![...n,...r].some(e=>e.contains(t.target))){for(const e of t.removedNodes)e instanceof Element&&(n.delete(e),r.delete(e));for(const e of t.addedNodes)!(e instanceof HTMLElement||e instanceof SVGElement)||"true"!==e.dataset.liveAnnouncer&&"true"!==e.dataset.reactAriaTopLayer?e instanceof Element&&o(e):n.add(e)}});s.observe(t,{childList:!0,subtree:!0});const a={observe(){s.observe(t,{childList:!0,subtree:!0})},disconnect(){s.disconnect()}};return Bo.push(a),()=>{s.disconnect();for(const e of r){const t=Ro.get(e);if(null==t)return;1===t?(e.removeAttribute("aria-hidden"),Ro.delete(e)):Ro.set(e,t-1)}a===Bo[Bo.length-1]?(Bo.pop(),Bo.length&&Bo[Bo.length-1].observe()):Bo.splice(Bo.indexOf(a),1)}}(X(e.targets),X(e.root)))})}var Ro=new WeakMap,Bo=[];var Go=new Map,Uo=e=>{$(()=>{const t=Dn(e.style)??{},n=Dn(e.properties)??[],r={};for(const i in t)r[i]=e.element.style[i];const o=Go.get(e.key);o?o.activeCount++:Go.set(e.key,{activeCount:1,originalStyles:r,properties:n.map(e=>e.key)}),Object.assign(e.element.style,e.style);for(const i of n)e.element.style.setProperty(i.key,i.value);h(()=>{const t=Go.get(e.key);if(t)if(1===t.activeCount){Go.delete(e.key);for(const[n,r]of Object.entries(t.originalStyles))e.element.style[n]=r;for(const n of t.properties)e.element.style.removeProperty(n);0===e.element.style.length&&e.element.removeAttribute("style"),e.cleanup?.()}else t.activeCount--})})},Ho=(e,t)=>{switch(t){case"x":return[e.clientWidth,e.scrollLeft,e.scrollWidth];case"y":return[e.clientHeight,e.scrollTop,e.scrollHeight]}},Vo=(e,t)=>{const n=getComputedStyle(e),r="x"===t?n.overflowX:n.overflowY;return"auto"===r||"scroll"===r||"HTML"===e.tagName&&"visible"===r},[jo,No]=N([]),Wo=e=>[e.deltaX,e.deltaY],Qo=e=>e.changedTouches[0]?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[0,0],_o=(e,t,n,r)=>{const[o,i]=((e,t,n)=>{const r="x"===t&&"rtl"===window.getComputedStyle(e).direction?-1:1;let o=e,i=0,s=0,a=!1;do{const[e,l,d]=Ho(o,t),c=d-e-r*l;0===l&&0===c||!Vo(o,t)||(i+=c,s+=l),o===(n??document.documentElement)?a=!0:o=o._$host??o.parentElement}while(o&&!a);return[i,s]})(e,t,null!==r&&Xo(r,e)?r:void 0);return!(n>0&&Math.abs(o)<=1)&&!(n<0&&Math.abs(i)<1)},Xo=(e,t)=>{if(e.contains(t))return!0;let n=t;for(;n;){if(n===e)return!0;n=n._$host??n.parentElement}return!1},Zo=e=>{const t=i({element:null,enabled:!0,hideScrollbar:!0,preventScrollbarShift:!0,preventScrollbarShiftMode:"padding",restoreScrollPosition:!0,allowPinchZoom:!1},e),n=y();let r=[0,0],o=null,s=null;$(()=>{Dn(t.enabled)&&(No(e=>[...e,n]),h(()=>{No(e=>e.filter(e=>e!==n))}))}),$(()=>{if(!Dn(t.enabled)||!Dn(t.hideScrollbar))return;const{body:e}=document,n=window.innerWidth-e.offsetWidth;if(Dn(t.preventScrollbarShift)){const r={overflow:"hidden"},o=[];n>0&&("padding"===Dn(t.preventScrollbarShiftMode)?r.paddingRight=`calc(${window.getComputedStyle(e).paddingRight} + ${n}px)`:r.marginRight=`calc(${window.getComputedStyle(e).marginRight} + ${n}px)`,o.push({key:"--scrollbar-width",value:`${n}px`}));const i=window.scrollY,s=window.scrollX;Uo({key:"prevent-scroll",element:e,style:r,properties:o,cleanup:()=>{Dn(t.restoreScrollPosition)&&n>0&&window.scrollTo(s,i)}})}else Uo({key:"prevent-scroll",element:e,style:{overflow:"hidden"}})}),$(()=>{var e;(e=n,jo().indexOf(e)===jo().length-1&&Dn(t.enabled))&&(document.addEventListener("wheel",l,{passive:!1}),document.addEventListener("touchstart",a,{passive:!1}),document.addEventListener("touchmove",d,{passive:!1}),h(()=>{document.removeEventListener("wheel",l),document.removeEventListener("touchstart",a),document.removeEventListener("touchmove",d)}))});const a=e=>{r=Qo(e),o=null,s=null},l=e=>{const n=e.target,r=Dn(t.element),o=Wo(e),i=Math.abs(o[0])>Math.abs(o[1])?"x":"y",s=_o(n,i,"x"===i?o[0]:o[1],r);let a;a=!r||!Xo(r,n)||!s,a&&e.cancelable&&e.preventDefault()},d=e=>{const n=Dn(t.element),i=e.target;let a;if(2===e.touches.length)a=!Dn(t.allowPinchZoom);else{if(null==o||null===s){const t=Qo(e).map((e,t)=>r[t]-e),n=Math.abs(t[0])>Math.abs(t[1])?"x":"y";o=n,s="x"===n?t[0]:t[1]}if("range"===i.type)a=!1;else{const e=_o(i,o,s,n);a=!n||!Xo(n,i)||!e}}a&&e.cancelable&&e.preventDefault()}},Yo=F();function Jo(){return p(Yo)}function ei(){const e=Jo();if(void 0===e)throw new Error("[kobalte]: `useMenuContext` must be used within a `Menu` component");return e}var ti=F();function ni(){const e=p(ti);if(void 0===e)throw new Error("[kobalte]: `useMenuItemContext` must be used within a `Menu.Item` component");return e}var ri=F();function oi(){const e=p(ri);if(void 0===e)throw new Error("[kobalte]: `useMenuRootContext` must be used within a `MenuRoot` component");return e}function ii(e){let t;const n=oi(),r=ei(),[o,a]=s(zt({id:n.generateId(`item-${y()}`)},e),["ref","textValue","disabled","closeOnSelect","checked","indeterminate","onSelect","onPointerMove","onPointerLeave","onPointerDown","onPointerUp","onClick","onKeyDown","onMouseDown","onFocus"]),[l,d]=N(),[c,u]=N(),[g,f]=N(),p=()=>r.listState().selectionManager(),h=()=>a.id,v=()=>{o.onSelect?.(),o.closeOnSelect&&setTimeout(()=>{r.close(!0)})};ln({getItem:()=>({ref:()=>t,type:"item",key:h(),textValue:o.textValue??g()?.textContent??t?.textContent??"",disabled:o.disabled??!1})});const m=qn({key:h,selectionManager:p,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>o.disabled},()=>t),b=e=>{vt(e,o.onPointerMove),"mouse"===e.pointerType&&(o.disabled?r.onItemLeave(e):(r.onItemEnter(e),e.defaultPrevented||(xt(e.currentTarget),r.listState().selectionManager().setFocused(!0),r.listState().selectionManager().setFocusedKey(h()))))},x=e=>{vt(e,o.onPointerLeave),"mouse"===e.pointerType&&r.onItemLeave(e)},w=e=>{vt(e,o.onPointerUp),o.disabled||0!==e.button||v()},k=e=>{if(vt(e,o.onKeyDown),!e.repeat&&!o.disabled)switch(e.key){case"Enter":case" ":v()}},$=V(()=>o.indeterminate?"mixed":null!=o.checked?o.checked:void 0),S=V(()=>({"data-indeterminate":o.indeterminate?"":void 0,"data-checked":o.checked&&!o.indeterminate?"":void 0,"data-disabled":o.disabled?"":void 0,"data-highlighted":p().focusedKey()===h()?"":void 0})),C={isChecked:()=>o.checked,dataset:S,setLabelRef:f,generateId:lt(()=>a.id),registerLabel:Bt(d),registerDescription:Bt(u)};return O(ti.Provider,{value:C,get children(){return O(Ht,i({as:"div",ref(e){const n=He(e=>t=e,o.ref);"function"==typeof n&&n(e)},get tabIndex(){return m.tabIndex()},get"aria-checked"(){return $()},get"aria-disabled"(){return o.disabled},get"aria-labelledby"(){return l()},get"aria-describedby"(){return c()},get"data-key"(){return m.dataKey()},get onPointerDown(){return mt([o.onPointerDown,m.onPointerDown])},get onPointerUp(){return mt([w,m.onPointerUp])},get onClick(){return mt([o.onClick,m.onClick])},get onKeyDown(){return mt([k,m.onKeyDown])},get onMouseDown(){return mt([o.onMouseDown,m.onMouseDown])},get onFocus(){return mt([o.onFocus,m.onFocus])},onPointerMove:b,onPointerLeave:x},S,a))}})}function si(e){const[t,n]=s(zt({closeOnSelect:!1},e),["checked","defaultChecked","onChange","onSelect"]),r=function(e={}){const[t,n]=Yt({value:()=>X(e.isSelected),defaultValue:()=>!!X(e.defaultIsSelected),onChange:t=>e.onSelectedChange?.(t)});return{isSelected:t,setIsSelected:t=>{X(e.isReadOnly)||X(e.isDisabled)||n(t)},toggle:()=>{X(e.isReadOnly)||X(e.isDisabled)||n(!t())}}}({isSelected:()=>t.checked,defaultIsSelected:()=>t.defaultChecked,onSelectedChange:e=>t.onChange?.(e),isDisabled:()=>n.disabled});return O(ii,i({role:"menuitemcheckbox",get checked(){return r.isSelected()},onSelect:()=>{t.onSelect?.(),r.toggle()}},n))}var ai=F();function li(){return p(ai)}var di={next:(e,t)=>"ltr"===e?"horizontal"===t?"ArrowRight":"ArrowDown":"horizontal"===t?"ArrowLeft":"ArrowUp",previous:(e,t)=>di.next("ltr"===e?"rtl":"ltr",t)},ci=e=>"horizontal"===e?"ArrowDown":"ArrowRight",ui=e=>"horizontal"===e?"ArrowUp":"ArrowLeft";function gi(e){const t=oi(),n=ei(),r=li(),{direction:o}=bn(),[a,l]=s(zt({id:t.generateId("trigger")},e),["ref","id","disabled","onPointerDown","onClick","onKeyDown","onMouseOver","onFocus"]);let d=()=>t.value();void 0!==r&&(d=()=>t.value()??a.id,void 0===r.lastValue()&&r.setLastValue(d));const c=Gt(()=>n.triggerRef(),()=>"button"),g=V(()=>"a"===c()&&null!=n.triggerRef()?.getAttribute("href"));$(u(()=>r?.value(),e=>{g()&&e===d()&&n.triggerRef()?.focus()}));const f=()=>{void 0!==r?n.isOpen()?r.value()===d()&&r.closeMenu():(r.autoFocusMenu()||r.setAutoFocusMenu(!0),n.open(!1)):n.toggle(!0)};return $(()=>h(n.registerTriggerId(a.id))),O(Un,i({ref(e){const t=He(n.setTriggerRef,a.ref);"function"==typeof t&&t(e)},get"data-kb-menu-value-trigger"(){return t.value()},get id(){return a.id},get disabled(){return a.disabled},"aria-haspopup":"true",get"aria-expanded"(){return n.isOpen()},get"aria-controls"(){return V(()=>!!n.isOpen())()?n.contentId():void 0},get"data-highlighted"(){return void 0!==d()&&r?.value()===d()||void 0},get tabIndex(){return void 0!==r?r.value()===d()||r.lastValue()===d()?0:-1:void 0},onPointerDown:e=>{vt(e,a.onPointerDown),e.currentTarget.dataset.pointerType=e.pointerType,a.disabled||"touch"===e.pointerType||0!==e.button||f()},onMouseOver:e=>{vt(e,a.onMouseOver),"touch"!==n.triggerRef()?.dataset.pointerType&&(a.disabled||void 0===r||void 0===r.value()||r.setValue(d))},onClick:e=>{vt(e,a.onClick),a.disabled||"touch"===e.currentTarget.dataset.pointerType&&f()},onKeyDown:e=>{if(vt(e,a.onKeyDown),!a.disabled){if(g())switch(e.key){case"Enter":case" ":return}switch(e.key){case"Enter":case" ":case ci(t.orientation()):e.stopPropagation(),e.preventDefault(),function(e){if(document.contains(e)){const t=document.scrollingElement||document.documentElement;if("hidden"!==window.getComputedStyle(t).overflow){const{left:t,top:n}=e.getBoundingClientRect();e?.scrollIntoView?.({block:"nearest"});const{left:r,top:o}=e.getBoundingClientRect();(Math.abs(t-r)>1||Math.abs(n-o)>1)&&e.scrollIntoView?.({block:"nearest"})}else{let n=Lt(e);for(;e&&n&&e!==t&&n!==t;)Pt(n,e),n=Lt(e=n)}}}(e.currentTarget),n.open("first"),r?.setAutoFocusMenu(!0),r?.setValue(d);break;case ui(t.orientation()):e.stopPropagation(),e.preventDefault(),n.open("last");break;case di.next(o(),t.orientation()):if(void 0===r)break;e.stopPropagation(),e.preventDefault(),r.nextMenu();break;case di.previous(o(),t.orientation()):if(void 0===r)break;e.stopPropagation(),e.preventDefault(),r.previousMenu()}}},onFocus:e=>{vt(e,a.onFocus),void 0!==r&&"touch"!==e.currentTarget.dataset.pointerType&&r.setValue(d)},role:void 0!==r?"menuitem":void 0},()=>n.dataset(),l))}var fi=F();function pi(){return p(fi)}function hi(e){let t;const n=oi(),r=ei(),o=li(),a=pi(),{direction:l}=bn(),[d,c]=s(zt({id:n.generateId(`content-${y()}`)},e),["ref","id","style","onOpenAutoFocus","onCloseAutoFocus","onEscapeKeyDown","onFocusOutside","onPointerEnter","onPointerMove","onKeyDown","onMouseDown","onFocusIn","onFocusOut"]);let u=0;const g=()=>null==r.parentMenuContext()&&void 0===o&&n.isModal(),f=Do({selectionManager:r.listState().selectionManager,collection:r.listState().collection,autoFocus:r.autoFocus,deferAutoFocus:!0,shouldFocusWrap:!0,disallowTypeAhead:()=>!r.listState().selectionManager().isFocused(),orientation:()=>"horizontal"===n.orientation()?"vertical":"horizontal"},()=>t);Io({trapFocus:()=>g()&&r.isOpen(),onMountAutoFocus:e=>{void 0===o&&d.onOpenAutoFocus?.(e)},onUnmountAutoFocus:d.onCloseAutoFocus},()=>t);const p=e=>{d.onEscapeKeyDown?.(e),o?.setAutoFocusMenu(!1),r.close(!0)},v=e=>{d.onFocusOutside?.(e),n.isModal()&&e.preventDefault()};$(()=>h(r.registerContentId(d.id)));const m={ref:He(e=>{r.setContentRef(e),t=e},d.ref),role:"menu",get id(){return d.id},get tabIndex(){return f.tabIndex()},get"aria-labelledby"(){return r.triggerId()},onKeyDown:mt([d.onKeyDown,f.onKeyDown,e=>{if(dt(e.currentTarget,e.target)&&("Tab"===e.key&&r.isOpen()&&e.preventDefault(),void 0!==o&&"true"!==e.currentTarget.getAttribute("aria-haspopup")))switch(e.key){case di.next(l(),n.orientation()):e.stopPropagation(),e.preventDefault(),r.close(!0),o.setAutoFocusMenu(!0),o.nextMenu();break;case di.previous(l(),n.orientation()):if(e.currentTarget.hasAttribute("data-closed"))break;e.stopPropagation(),e.preventDefault(),r.close(!0),o.setAutoFocusMenu(!0),o.previousMenu()}}]),onMouseDown:mt([d.onMouseDown,f.onMouseDown]),onFocusIn:mt([d.onFocusIn,f.onFocusIn]),onFocusOut:mt([d.onFocusOut,f.onFocusOut]),onPointerEnter:e=>{vt(e,d.onPointerEnter),r.isOpen()&&(r.parentMenuContext()?.listState().selectionManager().setFocused(!1),r.parentMenuContext()?.listState().selectionManager().setFocusedKey(void 0))},onPointerMove:e=>{if(vt(e,d.onPointerMove),"mouse"!==e.pointerType)return;const t=e.target,n=u!==e.clientX;dt(e.currentTarget,t)&&n&&(r.setPointerDir(e.clientX>u?"right":"left"),u=e.clientX)},get"data-orientation"(){return n.orientation()}};return O(G,{get when(){return r.contentPresent()},get children(){return O(G,{get when(){return void 0===a||null!=r.parentMenuContext()},get fallback(){return O(Ht,i({as:"div"},()=>r.dataset(),m,c))},get children(){return O(co.Positioner,{get children(){return O(po,i({get disableOutsidePointerEvents(){return V(()=>!!g())()&&r.isOpen()},get excludedElements(){return[r.triggerRef]},bypassTopMostLayerCheck:!0,get style(){return ot({"--kb-menu-content-transform-origin":"var(--kb-popper-content-transform-origin)",position:"relative"},d.style)},onEscapeKeyDown:p,onFocusOutside:v,get onDismiss(){return r.close}},()=>r.dataset(),m,c))}})}})}})}function yi(e){let t;const n=oi(),r=ei(),[o,a]=s(e,["ref"]);return Zo({element:()=>t??null,enabled:()=>r.contentPresent()&&n.preventScroll()}),O(hi,i({ref(e){const n=He(e=>{t=e},o.ref);"function"==typeof n&&n(e)}},a))}var vi=F();function mi(e){const t=zt({id:oi().generateId(`group-${y()}`)},e),[n,r]=N(),o={generateId:lt(()=>t.id),registerLabelId:Bt(r)};return O(vi.Provider,{value:o,get children(){return O(Ht,i({as:"div",role:"group",get"aria-labelledby"(){return n()}},t))}})}function bi(e){const t=function(){const e=p(vi);if(void 0===e)throw new Error("[kobalte]: `useMenuGroupContext` must be used within a `Menu.Group` component");return e}(),[n,r]=s(zt({id:t.generateId("label")},e),["id"]);return $(()=>h(t.registerLabelId(n.id))),O(Ht,i({as:"span",get id(){return n.id},"aria-hidden":"true"},r))}function xi(e){const t=ei();return O(Ht,i({as:"span","aria-hidden":"true"},()=>t.dataset(),zt({children:"\u25bc"},e)))}function wi(e){return O(ii,i({role:"menuitem",closeOnSelect:!0},e))}function ki(e){const t=ni(),[n,r]=s(zt({id:t.generateId("description")},e),["id"]);return $(()=>h(t.registerDescription(n.id))),O(Ht,i({as:"div",get id(){return n.id}},()=>t.dataset(),r))}function $i(e){const t=ni(),[n,r]=s(zt({id:t.generateId("indicator")},e),["forceMount"]);return O(G,{get when(){return n.forceMount||t.isChecked()},get children(){return O(Ht,i({as:"div"},()=>t.dataset(),r))}})}function Si(e){const t=ni(),[n,r]=s(zt({id:t.generateId("label")},e),["ref","id"]);return $(()=>h(t.registerLabel(n.id))),O(Ht,i({as:"div",ref(e){const r=He(t.setLabelRef,n.ref);"function"==typeof r&&r(e)},get id(){return n.id}},()=>t.dataset(),r))}function Ci(e){const t=ei();return O(G,{get when(){return t.contentPresent()},get children(){return O(P,e)}})}var Ei=F();function qi(e){const[t,n]=s(zt({id:oi().generateId(`radiogroup-${y()}`)},e),["value","defaultValue","onChange","disabled"]),[r,o]=Zt({value:()=>t.value,defaultValue:()=>t.defaultValue,onChange:e=>t.onChange?.(e)}),i={isDisabled:()=>t.disabled,isSelectedValue:e=>e===r(),setSelectedValue:o};return O(Ei.Provider,{value:i,get children(){return O(mi,n)}})}function Mi(e){const t=function(){const e=p(Ei);if(void 0===e)throw new Error("[kobalte]: `useMenuRadioGroupContext` must be used within a `Menu.RadioGroup` component");return e}(),[n,r]=s(zt({closeOnSelect:!1},e),["value","onSelect"]);return O(ii,i({role:"menuitemradio",get checked(){return t.isSelectedValue(n.value)},onSelect:()=>{n.onSelect?.(),t.setSelectedValue(n.value)}},r))}function Fi(e,t,n){const r=e.split("-")[0],o=n.getBoundingClientRect(),i=[],s=t.clientX,a=t.clientY;switch(r){case"top":i.push([s,a+5]),i.push([o.left,o.bottom]),i.push([o.left,o.top]),i.push([o.right,o.top]),i.push([o.right,o.bottom]);break;case"right":i.push([s-5,a]),i.push([o.left,o.top]),i.push([o.right,o.top]),i.push([o.right,o.bottom]),i.push([o.left,o.bottom]);break;case"bottom":i.push([s,a-5]),i.push([o.right,o.top]),i.push([o.right,o.bottom]),i.push([o.left,o.bottom]),i.push([o.left,o.top]);break;case"left":i.push([s+5,a]),i.push([o.right,o.bottom]),i.push([o.left,o.bottom]),i.push([o.left,o.top]),i.push([o.right,o.top])}return i}function Li(e){const t=oi(),n=nn(),r=Jo(),o=li(),a=pi(),[l,d]=s(zt({placement:"horizontal"===t.orientation()?"bottom-start":"right-start"},e),["open","defaultOpen","onOpenChange"]);let c=0,u=null,g="right";const[f,p]=N(),[y,v]=N(),[m,b]=N(),[x,w]=N(),[k,S]=N(!0),[C,E]=N(d.placement),[q,M]=N([]),[F,D]=N([]),{DomCollectionProvider:T}=an({items:F,onItemsChange:D}),z=ho({open:()=>l.open,defaultOpen:()=>l.defaultOpen,onOpenChange:e=>l.onOpenChange?.(e)}),{present:A}=Tn({show:()=>t.forceMount()||z.isOpen(),element:()=>x()??null}),I=function(e){const t=Cn(e),n=cn({dataSource:()=>X(e.dataSource),getKey:()=>X(e.getKey),getTextValue:()=>X(e.getTextValue),getDisabled:()=>X(e.getDisabled),getSectionChildren:()=>X(e.getSectionChildren),factory:t=>e.filter?new Fn(e.filter(t)):new Fn(t)},[()=>e.filter]),r=new Mn(n,t);return L(()=>{const e=t.focusedKey();null==e||n().getItem(e)||t.setFocusedKey(void 0)}),{collection:n,selectionManager:()=>r}}({selectionMode:"none",dataSource:F}),P=e=>{S(e),z.open()},K=(e=!1)=>{z.close(),e&&r&&r.close(!0)},R=()=>{const e=x();e&&(xt(e),I.selectionManager().setFocused(!0),I.selectionManager().setFocusedKey(void 0))},B=()=>{null!=a?setTimeout(()=>R()):R()},U=e=>{return g===u?.side&&(t=e,n=u?.area,!!n&&function(e,t){const[n,r]=e;let o=!1;for(let i=t.length,s=0,a=i-1;s<i;a=s++){const[e,l]=t[s],[d,c]=t[a],[,u]=t[0===a?i-1:a-1]||[0,0],g=(l-c)*(n-e)-(e-d)*(r-l);if(c<l){if(r>=c&&r<l){if(0===g)return!0;g>0&&(r===c?r>u&&(o=!o):o=!o)}}else if(l<c){if(r>l&&r<=c){if(0===g)return!0;g<0&&(r===c?r<u&&(o=!o):o=!o)}}else if(r==l&&(n>=d&&n<=e||n>=e&&n<=d))return!0}return o}([t.clientX,t.clientY],n));var t,n};Ko({isDisabled:()=>!(null==r&&z.isOpen()&&t.isModal()),targets:()=>[x(),...q()].filter(Boolean)}),$(()=>{const e=x();if(!e||!r)return;const t=r.registerNestedMenu(e);h(()=>{t()})}),$(()=>{void 0===r&&o?.registerMenu(t.value(),[x(),...q()])}),$(()=>{void 0===r&&void 0!==o&&(o.value()===t.value()?(m()?.focus(),o.autoFocusMenu()&&P(!0)):K())}),$(()=>{void 0===r&&void 0!==o&&z.isOpen()&&o.setValue(t.value())}),h(()=>{void 0===r&&o?.unregisterMenu(t.value())});const H={dataset:V(()=>({"data-expanded":z.isOpen()?"":void 0,"data-closed":z.isOpen()?void 0:""})),isOpen:z.isOpen,contentPresent:A,nestedMenus:q,currentPlacement:C,pointerGraceTimeoutId:()=>c,autoFocus:k,listState:()=>I,parentMenuContext:()=>r,triggerRef:m,contentRef:x,triggerId:f,contentId:y,setTriggerRef:b,setContentRef:w,open:P,close:K,toggle:e=>{S(e),z.toggle()},focusContent:B,onItemEnter:e=>{U(e)&&e.preventDefault()},onItemLeave:e=>{U(e)||B()},onTriggerLeave:e=>{U(e)&&e.preventDefault()},setPointerDir:e=>g=e,setPointerGraceTimeoutId:e=>c=e,setPointerGraceIntent:e=>u=e,registerNestedMenu:e=>{M(t=>[...t,e]);const t=r?.registerNestedMenu(e);return()=>{M(t=>it(t,e)),t?.()}},registerItemToParentDomCollection:n?.registerItem,registerTriggerId:Bt(p),registerContentId:Bt(v)};return O(T,{get children(){return O(Yo.Provider,{value:H,get children(){return O(G,{when:void 0===a,get fallback(){return d.children},get children(){return O(co,i({anchorRef:m,contentRef:x,onCurrentPlacementChange:E},d))}})}})}})}function Di(e){const{direction:t}=bn();return O(Li,i({get placement(){return"rtl"===t()?"left-start":"right-start"},flip:!0},e))}var Ti=(e,t)=>"ltr"===e?["horizontal"===t?"ArrowLeft":"ArrowUp"]:["horizontal"===t?"ArrowRight":"ArrowDown"];function zi(e){const t=ei(),n=oi(),[r,o]=s(e,["onFocusOutside","onKeyDown"]),{direction:a}=bn();return O(hi,i({onOpenAutoFocus:e=>{e.preventDefault()},onCloseAutoFocus:e=>{e.preventDefault()},onFocusOutside:e=>{r.onFocusOutside?.(e);const n=e.target;dt(t.triggerRef(),n)||t.close()},onKeyDown:e=>{vt(e,r.onKeyDown);const o=dt(e.currentTarget,e.target),i=Ti(a(),n.orientation()).includes(e.key),s=null!=t.parentMenuContext();o&&i&&s&&(t.close(),xt(t.triggerRef()))}},o))}var Ai=["Enter"," "],Oi=(e,t)=>"ltr"===e?[...Ai,"horizontal"===t?"ArrowRight":"ArrowDown"]:[...Ai,"horizontal"===t?"ArrowLeft":"ArrowUp"];function Ii(e){let t;const n=oi(),r=ei(),[o,a]=s(zt({id:n.generateId(`sub-trigger-${y()}`)},e),["ref","id","textValue","disabled","onPointerMove","onPointerLeave","onPointerDown","onPointerUp","onClick","onKeyDown","onMouseDown","onFocus"]);let l=null;const d=()=>{l&&window.clearTimeout(l),l=null},{direction:c}=bn(),g=()=>o.id,f=()=>{const e=r.parentMenuContext();if(null==e)throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");return e.listState().selectionManager()},p=qn({key:g,selectionManager:f,shouldSelectOnPressUp:!0,allowsDifferentPressOrigin:!0,disabled:()=>o.disabled},()=>t),v=e=>{vt(e,o.onClick),r.isOpen()||o.disabled||r.open(!0)},m=e=>{vt(e,o.onKeyDown),e.repeat||o.disabled||Oi(c(),n.orientation()).includes(e.key)&&(e.stopPropagation(),e.preventDefault(),f().setFocused(!1),f().setFocusedKey(void 0),r.isOpen()||r.open("first"),r.focusContent(),r.listState().selectionManager().setFocused(!0),r.listState().selectionManager().setFocusedKey(r.listState().collection().getFirstKey()))};return $(()=>{if(null==r.registerItemToParentDomCollection)throw new Error("[kobalte]: `Menu.SubTrigger` must be used within a `Menu.Sub` component");h(r.registerItemToParentDomCollection({ref:()=>t,type:"item",key:g(),textValue:o.textValue??t?.textContent??"",disabled:o.disabled??!1}))}),$(u(()=>r.parentMenuContext()?.pointerGraceTimeoutId(),e=>{h(()=>{window.clearTimeout(e),r.parentMenuContext()?.setPointerGraceIntent(null)})})),$(()=>h(r.registerTriggerId(o.id))),h(()=>{d()}),O(Ht,i({as:"div",ref(e){const n=He(e=>{r.setTriggerRef(e),t=e},o.ref);"function"==typeof n&&n(e)},get id(){return o.id},role:"menuitem",get tabIndex(){return p.tabIndex()},"aria-haspopup":"true",get"aria-expanded"(){return r.isOpen()},get"aria-controls"(){return V(()=>!!r.isOpen())()?r.contentId():void 0},get"aria-disabled"(){return o.disabled},get"data-key"(){return p.dataKey()},get"data-highlighted"(){return f().focusedKey()===g()?"":void 0},get"data-disabled"(){return o.disabled?"":void 0},get onPointerDown(){return mt([o.onPointerDown,p.onPointerDown])},get onPointerUp(){return mt([o.onPointerUp,p.onPointerUp])},get onClick(){return mt([v,p.onClick])},get onKeyDown(){return mt([m,p.onKeyDown])},get onMouseDown(){return mt([o.onMouseDown,p.onMouseDown])},get onFocus(){return mt([o.onFocus,p.onFocus])},onPointerMove:e=>{if(vt(e,o.onPointerMove),"mouse"!==e.pointerType)return;const t=r.parentMenuContext();t?.onItemEnter(e),e.defaultPrevented||(o.disabled?t?.onItemLeave(e):(r.isOpen()||l||(r.parentMenuContext()?.setPointerGraceIntent(null),l=window.setTimeout(()=>{r.open(!1),d()},100)),t?.onItemEnter(e),e.defaultPrevented||(r.listState().selectionManager().isFocused()&&(r.listState().selectionManager().setFocused(!1),r.listState().selectionManager().setFocusedKey(void 0)),xt(e.currentTarget),t?.listState().selectionManager().setFocused(!0),t?.listState().selectionManager().setFocusedKey(g()))))},onPointerLeave:e=>{if(vt(e,o.onPointerLeave),"mouse"!==e.pointerType)return;d();const t=r.parentMenuContext(),n=r.contentRef();if(n){t?.setPointerGraceIntent({area:Fi(r.currentPlacement(),e,n),side:r.currentPlacement().split("-")[0]}),window.clearTimeout(t?.pointerGraceTimeoutId());const o=window.setTimeout(()=>{t?.setPointerGraceIntent(null)},300);t?.setPointerGraceTimeoutId(o)}else{if(t?.onTriggerLeave(e),e.defaultPrevented)return;t?.setPointerGraceIntent(null)}t?.onItemLeave(e)}},()=>r.dataset(),a))}function Pi(e){const t=li(),[n,r]=s(zt({id:`menu-${y()}`,modal:!0},e),["id","modal","preventScroll","forceMount","open","defaultOpen","onOpenChange","value","orientation"]),o=ho({open:()=>n.open,defaultOpen:()=>n.defaultOpen,onOpenChange:e=>n.onOpenChange?.(e)}),a={isModal:()=>n.modal??!0,preventScroll:()=>n.preventScroll??a.isModal(),forceMount:()=>n.forceMount??!1,generateId:lt(()=>n.id),value:()=>n.value,orientation:()=>n.orientation??t?.orientation()??"horizontal"};return O(ri.Provider,{value:a,get children(){return O(Li,i({get open(){return o.isOpen()},get onOpenChange(){return o.setIsOpen}},r))}})}function Ki(e){let t;const[n,r]=s(zt({orientation:"horizontal"},e),["ref","orientation"]),o=Gt(()=>t,()=>"hr");return O(Ht,i({as:"hr",ref(e){const r=He(e=>t=e,n.ref);"function"==typeof r&&r(e)},get role(){return"hr"!==o()?"separator":void 0},get"aria-orientation"(){return"vertical"===n.orientation?"vertical":void 0},get"data-orientation"(){return n.orientation}},r))}en({},{Root:()=>Ki,Separator:()=>Ri});var Ri=Ki,Bi={};function Gi(e){const t=oi(),n=ei(),[r,o]=s(e,["onCloseAutoFocus","onInteractOutside"]);let a=!1;return O(yi,i({onCloseAutoFocus:e=>{r.onCloseAutoFocus?.(e),a||xt(n.triggerRef()),a=!1,e.preventDefault()},onInteractOutside:e=>{r.onInteractOutside?.(e),t.isModal()&&!e.detail.isContextMenu||(a=!0)}},o))}function Ui(e){return O(Pi,zt({id:`dropdownmenu-${y()}`},e))}en(Bi,{Arrow:()=>io,CheckboxItem:()=>si,Content:()=>Gi,DropdownMenu:()=>Hi,Group:()=>mi,GroupLabel:()=>bi,Icon:()=>xi,Item:()=>wi,ItemDescription:()=>ki,ItemIndicator:()=>$i,ItemLabel:()=>Si,Portal:()=>Ci,RadioGroup:()=>qi,RadioItem:()=>Mi,Root:()=>Ui,Separator:()=>Ki,Sub:()=>Di,SubContent:()=>zi,SubTrigger:()=>Ii,Trigger:()=>gi});var Hi=Object.assign(Ui,{Arrow:io,CheckboxItem:si,Content:Gi,Group:mi,GroupLabel:bi,Icon:xi,Item:wi,ItemDescription:ki,ItemIndicator:$i,ItemLabel:Si,Portal:Ci,RadioGroup:qi,RadioItem:Mi,Separator:Ki,Sub:Di,SubContent:zi,SubTrigger:Ii,Trigger:gi}),Vi={colors:{inherit:"inherit",current:"currentColor",transparent:"transparent",black:"#000000",white:"#ffffff",neutral:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},darkGray:{50:"#525c7a",100:"#49536e",200:"#414962",300:"#394056",400:"#313749",500:"#292e3d",600:"#212530",700:"#191c24",800:"#111318",900:"#0b0d10"},gray:{50:"#f9fafb",100:"#f2f4f7",200:"#eaecf0",300:"#d0d5dd",400:"#98a2b3",500:"#667085",600:"#475467",700:"#344054",800:"#1d2939",900:"#101828"},blue:{25:"#F5FAFF",50:"#EFF8FF",100:"#D1E9FF",200:"#B2DDFF",300:"#84CAFF",400:"#53B1FD",500:"#2E90FA",600:"#1570EF",700:"#175CD3",800:"#1849A9",900:"#194185"},green:{25:"#F6FEF9",50:"#ECFDF3",100:"#D1FADF",200:"#A6F4C5",300:"#6CE9A6",400:"#32D583",500:"#12B76A",600:"#039855",700:"#027A48",800:"#05603A",900:"#054F31"},red:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},yellow:{25:"#FFFCF5",50:"#FFFAEB",100:"#FEF0C7",200:"#FEDF89",300:"#FEC84B",400:"#FDB022",500:"#F79009",600:"#DC6803",700:"#B54708",800:"#93370D",900:"#7A2E0E"},purple:{25:"#FAFAFF",50:"#F4F3FF",100:"#EBE9FE",200:"#D9D6FE",300:"#BDB4FE",400:"#9B8AFB",500:"#7A5AF8",600:"#6938EF",700:"#5925DC",800:"#4A1FB8",900:"#3E1C96"},teal:{25:"#F6FEFC",50:"#F0FDF9",100:"#CCFBEF",200:"#99F6E0",300:"#5FE9D0",400:"#2ED3B7",500:"#15B79E",600:"#0E9384",700:"#107569",800:"#125D56",900:"#134E48"},pink:{25:"#fdf2f8",50:"#fce7f3",100:"#fbcfe8",200:"#f9a8d4",300:"#f472b6",400:"#ec4899",500:"#db2777",600:"#be185d",700:"#9d174d",800:"#831843",900:"#500724"},cyan:{25:"#ecfeff",50:"#cffafe",100:"#a5f3fc",200:"#67e8f9",300:"#22d3ee",400:"#06b6d4",500:"#0891b2",600:"#0e7490",700:"#155e75",800:"#164e63",900:"#083344"}},alpha:{100:"ff",90:"e5",80:"cc",70:"b3",60:"99",50:"80",40:"66",30:"4d",20:"33",10:"1a",0:"00"},font:{size:{"2xs":"calc(var(--tsqd-font-size) * 0.625)",xs:"calc(var(--tsqd-font-size) * 0.75)",sm:"calc(var(--tsqd-font-size) * 0.875)",md:"var(--tsqd-font-size)",lg:"calc(var(--tsqd-font-size) * 1.125)",xl:"calc(var(--tsqd-font-size) * 1.25)","2xl":"calc(var(--tsqd-font-size) * 1.5)","3xl":"calc(var(--tsqd-font-size) * 1.875)","4xl":"calc(var(--tsqd-font-size) * 2.25)","5xl":"calc(var(--tsqd-font-size) * 3)","6xl":"calc(var(--tsqd-font-size) * 3.75)","7xl":"calc(var(--tsqd-font-size) * 4.5)","8xl":"calc(var(--tsqd-font-size) * 6)","9xl":"calc(var(--tsqd-font-size) * 8)"},lineHeight:{xs:"calc(var(--tsqd-font-size) * 1)",sm:"calc(var(--tsqd-font-size) * 1.25)",md:"calc(var(--tsqd-font-size) * 1.5)",lg:"calc(var(--tsqd-font-size) * 1.75)",xl:"calc(var(--tsqd-font-size) * 2)","2xl":"calc(var(--tsqd-font-size) * 2.25)","3xl":"calc(var(--tsqd-font-size) * 2.5)","4xl":"calc(var(--tsqd-font-size) * 2.75)","5xl":"calc(var(--tsqd-font-size) * 3)","6xl":"calc(var(--tsqd-font-size) * 3.25)","7xl":"calc(var(--tsqd-font-size) * 3.5)","8xl":"calc(var(--tsqd-font-size) * 3.75)","9xl":"calc(var(--tsqd-font-size) * 4)"},weight:{thin:"100",extralight:"200",light:"300",normal:"400",medium:"500",semibold:"600",bold:"700",extrabold:"800",black:"900"}},breakpoints:{xs:"320px",sm:"640px",md:"768px",lg:"1024px",xl:"1280px","2xl":"1536px"},border:{radius:{none:"0px",xs:"calc(var(--tsqd-font-size) * 0.125)",sm:"calc(var(--tsqd-font-size) * 0.25)",md:"calc(var(--tsqd-font-size) * 0.375)",lg:"calc(var(--tsqd-font-size) * 0.5)",xl:"calc(var(--tsqd-font-size) * 0.75)","2xl":"calc(var(--tsqd-font-size) * 1)","3xl":"calc(var(--tsqd-font-size) * 1.5)",full:"9999px"}},size:{0:"0px",.25:"calc(var(--tsqd-font-size) * 0.0625)",.5:"calc(var(--tsqd-font-size) * 0.125)",1:"calc(var(--tsqd-font-size) * 0.25)",1.5:"calc(var(--tsqd-font-size) * 0.375)",2:"calc(var(--tsqd-font-size) * 0.5)",2.5:"calc(var(--tsqd-font-size) * 0.625)",3:"calc(var(--tsqd-font-size) * 0.75)",3.5:"calc(var(--tsqd-font-size) * 0.875)",4:"calc(var(--tsqd-font-size) * 1)",4.5:"calc(var(--tsqd-font-size) * 1.125)",5:"calc(var(--tsqd-font-size) * 1.25)",5.5:"calc(var(--tsqd-font-size) * 1.375)",6:"calc(var(--tsqd-font-size) * 1.5)",6.5:"calc(var(--tsqd-font-size) * 1.625)",7:"calc(var(--tsqd-font-size) * 1.75)",8:"calc(var(--tsqd-font-size) * 2)",9:"calc(var(--tsqd-font-size) * 2.25)",10:"calc(var(--tsqd-font-size) * 2.5)",11:"calc(var(--tsqd-font-size) * 2.75)",12:"calc(var(--tsqd-font-size) * 3)",14:"calc(var(--tsqd-font-size) * 3.5)",16:"calc(var(--tsqd-font-size) * 4)",20:"calc(var(--tsqd-font-size) * 5)",24:"calc(var(--tsqd-font-size) * 6)",28:"calc(var(--tsqd-font-size) * 7)",32:"calc(var(--tsqd-font-size) * 8)",36:"calc(var(--tsqd-font-size) * 9)",40:"calc(var(--tsqd-font-size) * 10)",44:"calc(var(--tsqd-font-size) * 11)",48:"calc(var(--tsqd-font-size) * 12)",52:"calc(var(--tsqd-font-size) * 13)",56:"calc(var(--tsqd-font-size) * 14)",60:"calc(var(--tsqd-font-size) * 15)",64:"calc(var(--tsqd-font-size) * 16)",72:"calc(var(--tsqd-font-size) * 18)",80:"calc(var(--tsqd-font-size) * 20)",96:"calc(var(--tsqd-font-size) * 24)"},shadow:{xs:(e="rgb(0 0 0 / 0.1)")=>"0 1px 2px 0 rgb(0 0 0 / 0.05)",sm:(e="rgb(0 0 0 / 0.1)")=>`0 1px 3px 0 ${e}, 0 1px 2px -1px ${e}`,md:(e="rgb(0 0 0 / 0.1)")=>`0 4px 6px -1px ${e}, 0 2px 4px -2px ${e}`,lg:(e="rgb(0 0 0 / 0.1)")=>`0 10px 15px -3px ${e}, 0 4px 6px -4px ${e}`,xl:(e="rgb(0 0 0 / 0.1)")=>`0 20px 25px -5px ${e}, 0 8px 10px -6px ${e}`,"2xl":(e="rgb(0 0 0 / 0.25)")=>`0 25px 50px -12px ${e}`,inner:(e="rgb(0 0 0 / 0.05)")=>`inset 0 2px 4px 0 ${e}`,none:()=>"none"},zIndices:{hide:-1,auto:"auto",base:0,docked:10,dropdown:1e3,sticky:1100,banner:1200,overlay:1300,modal:1400,popover:1500,skipLink:1600,toast:1700,tooltip:1800}},ji=d('<svg width=14 height=14 viewBox="0 0 14 14"fill=none xmlns=http://www.w3.org/2000/svg><path d="M13 13L9.00007 9M10.3333 5.66667C10.3333 8.244 8.244 10.3333 5.66667 10.3333C3.08934 10.3333 1 8.244 1 5.66667C1 3.08934 3.08934 1 5.66667 1C8.244 1 10.3333 3.08934 10.3333 5.66667Z"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),Ni=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 3H15M3 6H21M19 6L18.2987 16.5193C18.1935 18.0975 18.1409 18.8867 17.8 19.485C17.4999 20.0118 17.0472 20.4353 16.5017 20.6997C15.882 21 15.0911 21 13.5093 21H10.4907C8.90891 21 8.11803 21 7.49834 20.6997C6.95276 20.4353 6.50009 20.0118 6.19998 19.485C5.85911 18.8867 5.8065 18.0975 5.70129 16.5193L5 6M10 10.5V15.5M14 10.5V15.5"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Wi=d('<svg width=10 height=6 viewBox="0 0 10 6"fill=none xmlns=http://www.w3.org/2000/svg><path d="M1 1L5 5L9 1"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),Qi=d('<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 13.3333V2.66667M8 2.66667L4 6.66667M8 2.66667L12 6.66667"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),_i=d('<svg width=12 height=12 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 2.66667V13.3333M8 13.3333L4 9.33333M8 13.3333L12 9.33333"stroke=currentColor stroke-width=1.66667 stroke-linecap=round stroke-linejoin=round>'),Xi=d('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Zi=d('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M22 15.844a10.424 10.424 0 0 1-4.306.925c-5.779 0-10.463-4.684-10.463-10.462 0-1.536.33-2.994.925-4.307A10.464 10.464 0 0 0 2 11.538C2 17.316 6.684 22 12.462 22c4.243 0 7.896-2.526 9.538-6.156Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Yi=d('<svg viewBox="0 0 24 24"height=12 width=12 fill=none xmlns=http://www.w3.org/2000/svg><path d="M8 21h8m-4-4v4m-5.2-4h10.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C22 14.72 22 13.88 22 12.2V7.8c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C19.72 3 18.88 3 17.2 3H6.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C2 5.28 2 6.12 2 7.8v4.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C4.28 17 5.12 17 6.8 17Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Ji=d('<svg stroke=currentColor fill=currentColor stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M0 0h24v24H0z"></path><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z">'),es=d('<svg stroke-width=0 viewBox="0 0 24 24"height=1em width=1em xmlns=http://www.w3.org/2000/svg><path fill=none d="M24 .01c0-.01 0-.01 0 0L0 0v24h24V.01zM0 0h24v24H0V0zm0 0h24v24H0V0z"></path><path d="M22.99 9C19.15 5.16 13.8 3.76 8.84 4.78l2.52 2.52c3.47-.17 6.99 1.05 9.63 3.7l2-2zm-4 4a9.793 9.793 0 00-4.49-2.56l3.53 3.53.96-.97zM2 3.05L5.07 6.1C3.6 6.82 2.22 7.78 1 9l1.99 2c1.24-1.24 2.67-2.16 4.2-2.77l2.24 2.24A9.684 9.684 0 005 13v.01L6.99 15a7.042 7.042 0 014.92-2.06L18.98 20l1.27-1.26L3.29 1.79 2 3.05zM9 17l3 3 3-3a4.237 4.237 0 00-6 0z">'),ts=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.3951 19.3711L9.97955 20.6856C10.1533 21.0768 10.4368 21.4093 10.7958 21.6426C11.1547 21.8759 11.5737 22.0001 12.0018 22C12.4299 22.0001 12.8488 21.8759 13.2078 21.6426C13.5667 21.4093 13.8503 21.0768 14.024 20.6856L14.6084 19.3711C14.8165 18.9047 15.1664 18.5159 15.6084 18.26C16.0532 18.0034 16.5678 17.8941 17.0784 17.9478L18.5084 18.1C18.9341 18.145 19.3637 18.0656 19.7451 17.8713C20.1265 17.6771 20.4434 17.3763 20.6573 17.0056C20.8715 16.635 20.9735 16.2103 20.9511 15.7829C20.9286 15.3555 20.7825 14.9438 20.5307 14.5978L19.684 13.4344C19.3825 13.0171 19.2214 12.5148 19.224 12C19.2239 11.4866 19.3865 10.9864 19.6884 10.5711L20.5351 9.40778C20.787 9.06175 20.933 8.65007 20.9555 8.22267C20.978 7.79528 20.8759 7.37054 20.6618 7C20.4479 6.62923 20.131 6.32849 19.7496 6.13423C19.3681 5.93997 18.9386 5.86053 18.5129 5.90556L17.0829 6.05778C16.5722 6.11141 16.0577 6.00212 15.6129 5.74556C15.17 5.48825 14.82 5.09736 14.6129 4.62889L14.024 3.31444C13.8503 2.92317 13.5667 2.59072 13.2078 2.3574C12.8488 2.12408 12.4299 1.99993 12.0018 2C11.5737 1.99993 11.1547 2.12408 10.7958 2.3574C10.4368 2.59072 10.1533 2.92317 9.97955 3.31444L9.3951 4.62889C9.18803 5.09736 8.83798 5.48825 8.3951 5.74556C7.95032 6.00212 7.43577 6.11141 6.9251 6.05778L5.49066 5.90556C5.06499 5.86053 4.6354 5.93997 4.25397 6.13423C3.87255 6.32849 3.55567 6.62923 3.34177 7C3.12759 7.37054 3.02555 7.79528 3.04804 8.22267C3.07052 8.65007 3.21656 9.06175 3.46844 9.40778L4.3151 10.5711C4.61704 10.9864 4.77964 11.4866 4.77955 12C4.77964 12.5134 4.61704 13.0137 4.3151 13.4289L3.46844 14.5922C3.21656 14.9382 3.07052 15.3499 3.04804 15.7773C3.02555 16.2047 3.12759 16.6295 3.34177 17C3.55589 17.3706 3.8728 17.6712 4.25417 17.8654C4.63554 18.0596 5.06502 18.1392 5.49066 18.0944L6.92066 17.9422C7.43133 17.8886 7.94587 17.9979 8.39066 18.2544C8.83519 18.511 9.18687 18.902 9.3951 19.3711Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><path d="M12 15C13.6568 15 15 13.6569 15 12C15 10.3431 13.6568 9 12 9C10.3431 9 8.99998 10.3431 8.99998 12C8.99998 13.6569 10.3431 15 12 15Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),ns=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M16 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V8M11.5 12.5L17 7M17 7H12M17 7V12M6.2 21H8.8C9.9201 21 10.4802 21 10.908 20.782C11.2843 20.5903 11.5903 20.2843 11.782 19.908C12 19.4802 12 18.9201 12 17.8V15.2C12 14.0799 12 13.5198 11.782 13.092C11.5903 12.7157 11.2843 12.4097 10.908 12.218C10.4802 12 9.92011 12 8.8 12H6.2C5.0799 12 4.51984 12 4.09202 12.218C3.71569 12.4097 3.40973 12.7157 3.21799 13.092C3 13.5198 3 14.0799 3 15.2V17.8C3 18.9201 3 19.4802 3.21799 19.908C3.40973 20.2843 3.71569 20.5903 4.09202 20.782C4.51984 21 5.07989 21 6.2 21Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),rs=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path class=copier d="M8 8V5.2C8 4.0799 8 3.51984 8.21799 3.09202C8.40973 2.71569 8.71569 2.40973 9.09202 2.21799C9.51984 2 10.0799 2 11.2 2H18.8C19.9201 2 20.4802 2 20.908 2.21799C21.2843 2.40973 21.5903 2.71569 21.782 3.09202C22 3.51984 22 4.0799 22 5.2V12.8C22 13.9201 22 14.4802 21.782 14.908C21.5903 15.2843 21.2843 15.5903 20.908 15.782C20.4802 16 19.9201 16 18.8 16H16M5.2 22H12.8C13.9201 22 14.4802 22 14.908 21.782C15.2843 21.5903 15.5903 21.2843 15.782 20.908C16 20.4802 16 19.9201 16 18.8V11.2C16 10.0799 16 9.51984 15.782 9.09202C15.5903 8.71569 15.2843 8.40973 14.908 8.21799C14.4802 8 13.9201 8 12.8 8H5.2C4.0799 8 3.51984 8 3.09202 8.21799C2.71569 8.40973 2.40973 8.71569 2.21799 9.09202C2 9.51984 2 10.0799 2 11.2V18.8C2 19.9201 2 20.4802 2.21799 20.908C2.40973 21.2843 2.71569 21.5903 3.09202 21.782C3.51984 22 4.07989 22 5.2 22Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round stroke=currentColor>'),os=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M2.5 21.4998L8.04927 19.3655C8.40421 19.229 8.58168 19.1607 8.74772 19.0716C8.8952 18.9924 9.0358 18.901 9.16804 18.7984C9.31692 18.6829 9.45137 18.5484 9.72028 18.2795L21 6.99982C22.1046 5.89525 22.1046 4.10438 21 2.99981C19.8955 1.89525 18.1046 1.89524 17 2.99981L5.72028 14.2795C5.45138 14.5484 5.31692 14.6829 5.20139 14.8318C5.09877 14.964 5.0074 15.1046 4.92823 15.2521C4.83911 15.4181 4.77085 15.5956 4.63433 15.9506L2.5 21.4998ZM2.5 21.4998L4.55812 16.1488C4.7054 15.7659 4.77903 15.5744 4.90534 15.4867C5.01572 15.4101 5.1523 15.3811 5.2843 15.4063C5.43533 15.4351 5.58038 15.5802 5.87048 15.8703L8.12957 18.1294C8.41967 18.4195 8.56472 18.5645 8.59356 18.7155C8.61877 18.8475 8.58979 18.9841 8.51314 19.0945C8.42545 19.2208 8.23399 19.2944 7.85107 19.4417L2.5 21.4998Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),is=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),ss=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9 9L15 15M15 9L9 15M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"stroke=#F04438 stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),as=d('<svg width=24 height=24 viewBox="0 0 24 24"fill=none stroke=currentColor stroke-width=2 xmlns=http://www.w3.org/2000/svg><rect class=list width=20 height=20 y=2 x=2 rx=2></rect><line class=list-item y1=7 y2=7 x1=6 x2=18></line><line class=list-item y2=12 y1=12 x1=6 x2=18></line><line class=list-item y1=17 y2=17 x1=6 x2=18>'),ls=d('<svg viewBox="0 0 24 24"height=20 width=20 fill=none xmlns=http://www.w3.org/2000/svg><path d="M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v8.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 21 17.88 21 16.2 21H7.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C3 18.72 3 17.88 3 16.2V7.8Z"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),ds=d('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),cs=d('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.0784 19.0784L16.25 16.25M19.0784 4.99994L16.25 7.82837M4.92157 19.0784L7.75 16.25M4.92157 4.99994L7.75 7.82837"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round></path><animateTransform attributeName=transform attributeType=XML type=rotate from=0 to=360 dur=2s repeatCount=indefinite>'),us=d('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M15 9L9 15M9 9L15 15M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),gs=d('<svg width=14 height=14 viewBox="0 0 24 24"fill=none xmlns=http://www.w3.org/2000/svg><path d="M9.5 15V9M14.5 15V9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"stroke=currentColor stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),fs=d('<svg version=1.0 viewBox="0 0 633 633"><linearGradient x1=-666.45 x2=-666.45 y1=163.28 y2=163.99 gradientTransform="matrix(633 0 0 633 422177 -103358)"gradientUnits=userSpaceOnUse><stop stop-color=#6BDAFF offset=0></stop><stop stop-color=#F9FFB5 offset=.32></stop><stop stop-color=#FFA770 offset=.71></stop><stop stop-color=#FF7373 offset=1></stop></linearGradient><circle cx=316.5 cy=316.5 r=316.5></circle><defs><filter x=-137.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=316.5 y=412 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=412 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=610.5 rx=214.5 ry=186 fill=#015064 stroke=#00CFE2 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=316.5 y=450 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=450 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=648.5 rx=214.5 ry=186 fill=#015064 stroke=#00A8B8 stroke-width=25></ellipse></g><defs><filter x=-137.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=-137.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=89.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=316.5 y=486 width=454 height=396.9 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=316.5 y=486 width=454 height=396.9 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><ellipse cx=543.5 cy=684.5 rx=214.5 ry=186 fill=#015064 stroke=#007782 stroke-width=25></ellipse></g><defs><filter x=272.2 y=308 width=176.9 height=129.3 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=272.2 y=308 width=176.9 height=129.3 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><line x1=436 x2=431 y1=403.2 y2=431.8 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=291 x2=280 y1=341.5 y2=403.5 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><line x1=332.9 x2=328.6 y1=384.1 y2=411.2 fill=none stroke=#000 stroke-linecap=round stroke-linejoin=bevel stroke-width=11></line><linearGradient x1=-670.75 x2=-671.59 y1=164.4 y2=164.49 gradientTransform="matrix(-184.16 -32.472 -11.461 64.997 -121359 -32126)"gradientUnits=userSpaceOnUse><stop stop-color=#EE2700 offset=0></stop><stop stop-color=#FF008E offset=1></stop></linearGradient><path d="m344.1 363 97.7 17.2c5.8 2.1 8.2 6.1 7.1 12.1s-4.7 9.2-11 9.9l-106-18.7-57.5-59.2c-3.2-4.8-2.9-9.1 0.8-12.8s8.3-4.4 13.7-2.1l55.2 53.6z"clip-rule=evenodd fill-rule=evenodd></path><line x1=428.2 x2=429.1 y1=384.5 y2=378 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=395.2 x2=396.1 y1=379.5 y2=373 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=362.2 x2=363.1 y1=373.5 y2=367.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=324.2 x2=328.4 y1=351.3 y2=347.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line><line x1=303.2 x2=307.4 y1=331.3 y2=327.4 fill=none stroke=#fff stroke-linecap=round stroke-linejoin=bevel stroke-width=7></line></g><defs><filter x=73.2 y=113.8 width=280.6 height=317.4 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=73.2 y=113.8 width=280.6 height=317.4 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-672.16 x2=-672.16 y1=165.03 y2=166.03 gradientTransform="matrix(-100.18 48.861 97.976 200.88 -83342 -93.059)"gradientUnits=userSpaceOnUse><stop stop-color=#A17500 offset=0></stop><stop stop-color=#5D2100 offset=1></stop></linearGradient><path d="m192.3 203c8.1 37.3 14 73.6 17.8 109.1 3.8 35.4 2.8 75.1-3 119.2l61.2-16.7c-15.6-59-25.2-97.9-28.6-116.6s-10.8-51.9-22.1-99.6l-25.3 4.6"clip-rule=evenodd fill-rule=evenodd></path><g stroke=#2F8A00><linearGradient x1=-660.23 x2=-660.23 y1=166.72 y2=167.72 gradientTransform="matrix(92.683 4.8573 -2.0259 38.657 61680 -3088.6)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9s-12.6-22.1-36.5-29.9c-15.9-5.2-34.4-1.5-55.5 11.1 15.9 14.3 29.5 22.6 40.7 24.9 16.8 3.6 51.3-6.1 51.3-6.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-661.36 x2=-661.36 y1=164.18 y2=165.18 gradientTransform="matrix(110 5.7648 -6.3599 121.35 73933 -15933)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5s-47.5-8.5-83.2 15.7c-23.8 16.2-34.3 49.3-31.6 99.4 30.3-27.8 52.1-48.5 65.2-61.9 19.8-20.2 49.6-53.2 49.6-53.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.79 x2=-656.79 y1=165.15 y2=166.15 gradientTransform="matrix(62.954 3.2993 -3.5023 66.828 42156 -8754.1)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m195 183.9c-0.8-21.9 6-38 20.6-48.2s29.8-15.4 45.5-15.3c-6.1 21.4-14.5 35.8-25.2 43.4s-24.4 14.2-40.9 20.1z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-663.07 x2=-663.07 y1=165.44 y2=166.44 gradientTransform="matrix(152.47 7.9907 -3.0936 59.029 101884 -4318.7)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c31.9-30 64.1-39.7 96.7-29s50.8 30.4 54.6 59.1c-35.2-5.5-60.4-9.6-75.8-12.1-15.3-2.6-40.5-8.6-75.5-18z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-662.57 x2=-662.57 y1=164.44 y2=165.44 gradientTransform="matrix(136.46 7.1517 -5.2163 99.533 91536 -11442)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c35.8-7.6 65.6-0.2 89.2 22s37.7 49 42.3 80.3c-39.8-9.7-68.3-23.8-85.5-42.4s-32.5-38.5-46-59.9z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><linearGradient x1=-656.43 x2=-656.43 y1=163.86 y2=164.86 gradientTransform="matrix(60.866 3.1899 -8.7773 167.48 41560 -25168)"gradientUnits=userSpaceOnUse><stop stop-color=#2F8A00 offset=0></stop><stop stop-color=#90FF57 offset=1></stop></linearGradient><path d="m194.9 184.5c-33.6 13.8-53.6 35.7-60.1 65.6s-3.6 63.1 8.7 99.6c27.4-40.3 43.2-69.6 47.4-88s5.6-44.1 4-77.2z"clip-rule=evenodd fill-rule=evenodd stroke-width=13></path><path d="m196.5 182.3c-14.8 21.6-25.1 41.4-30.8 59.4s-9.5 33-11.1 45.1"fill=none stroke-linecap=round stroke-width=8></path><path d="m194.9 185.7c-24.4 1.7-43.8 9-58.1 21.8s-24.7 25.4-31.3 37.8"fill=none stroke-linecap=round stroke-width=8></path><path d="m204.5 176.4c29.7-6.7 52-8.4 67-5.1s26.9 8.6 35.8 15.9"fill=none stroke-linecap=round stroke-width=8></path><path d="m196.5 181.4c20.3 9.9 38.2 20.5 53.9 31.9s27.4 22.1 35.1 32"fill=none stroke-linecap=round stroke-width=8></path></g></g><defs><filter x=50.5 y=399 width=532 height=633 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=50.5 y=399 width=532 height=633 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-666.06 x2=-666.23 y1=163.36 y2=163.75 gradientTransform="matrix(532 0 0 633 354760 -102959)"gradientUnits=userSpaceOnUse><stop stop-color=#FFF400 offset=0></stop><stop stop-color=#3C8700 offset=1></stop></linearGradient><ellipse cx=316.5 cy=715.5 rx=266 ry=316.5></ellipse></g><defs><filter x=391 y=-24 width=288 height=283 filterUnits=userSpaceOnUse><feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"></feColorMatrix></filter></defs><mask x=391 y=-24 width=288 height=283 maskUnits=userSpaceOnUse><g><circle cx=316.5 cy=316.5 r=316.5 fill=#fff></circle></g></mask><g><linearGradient x1=-664.56 x2=-664.56 y1=163.79 y2=164.79 gradientTransform="matrix(227 0 0 227 151421 -37204)"gradientUnits=userSpaceOnUse><stop stop-color=#FFDF00 offset=0></stop><stop stop-color=#FF9D00 offset=1></stop></linearGradient><circle cx=565.5 cy=89.5 r=113.5></circle><linearGradient x1=-644.5 x2=-645.77 y1=342 y2=342 gradientTransform="matrix(30 0 0 1 19770 -253)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=427 x2=397 y1=89 y2=89 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-641.56 x2=-642.83 y1=196.02 y2=196.07 gradientTransform="matrix(26.5 0 0 5.5 17439 -1025.5)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=430.5 x2=404 y1=55.5 y2=50 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-643.73 x2=-645 y1=185.83 y2=185.9 gradientTransform="matrix(29 0 0 8 19107 -1361)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=431 x2=402 y1=122 y2=130 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-638.94 x2=-640.22 y1=177.09 y2=177.39 gradientTransform="matrix(24 0 0 13 15783 -2145)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=442 x2=418 y1=153 y2=166 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-633.42 x2=-634.7 y1=172.41 y2=173.31 gradientTransform="matrix(20 0 0 19 13137 -3096)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=464 x2=444 y1=180 y2=199 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-619.05 x2=-619.52 y1=170.82 y2=171.82 gradientTransform="matrix(13.83 0 0 22.85 9050 -3703.4)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=491.4 x2=477.5 y1=203 y2=225.9 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=-578.5 x2=-578.63 y1=170.31 y2=171.31 gradientTransform="matrix(7.5 0 0 24.5 4860 -3953)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=524.5 x2=517 y1=219.5 y2=244 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12></line><linearGradient x1=666.5 x2=666.5 y1=170.31 y2=171.31 gradientTransform="matrix(.5 0 0 24.5 231.5 -3944)"gradientUnits=userSpaceOnUse><stop stop-color=#FFA400 offset=0></stop><stop stop-color=#FF5E00 offset=1></stop></linearGradient><line x1=564.5 x2=565 y1=228.5 y2=253 fill=none stroke-linecap=round stroke-linejoin=bevel stroke-width=12>');function ps(){return ji()}function hs(){return Ni()}function ys(){return Wi()}function vs(){return Qi()}function ms(){return _i()}function bs(){return(e=_i()).style.setProperty("transform","rotate(90deg)"),e;var e}function xs(){return(e=_i()).style.setProperty("transform","rotate(-90deg)"),e;var e}function ws(){return Xi()}function ks(){return Zi()}function $s(){return Yi()}function Ss(){return Ji()}function Cs(){return es()}function Es(){return ts()}function qs(){return ns()}function Ms(){return rs()}function Fs(){return os()}function Ls(e){return t=is(),n=t.firstChild,W(()=>a(n,"stroke","dark"===e.theme?"#12B76A":"#027A48")),t;var t,n}function Ds(){return ss()}function Ts(){return as()}function zs(e){return[O(G,{get when(){return e.checked},get children(){var t=is(),n=t.firstChild;return W(()=>a(n,"stroke","dark"===e.theme?"#9B8AFB":"#6938EF")),t}}),O(G,{get when(){return!e.checked},get children(){var t=ls(),n=t.firstChild;return W(()=>a(n,"stroke","dark"===e.theme?"#9B8AFB":"#6938EF")),t}})]}function As(){return ds()}function Os(){return cs()}function Is(){return us()}function Ps(){return gs()}function Ks(){const e=y();return t=fs(),n=t.firstChild,r=n.nextSibling,o=r.nextSibling,i=o.firstChild,s=o.nextSibling,l=s.firstChild,d=s.nextSibling,c=d.nextSibling,u=c.firstChild,g=c.nextSibling,f=g.firstChild,p=g.nextSibling,h=p.nextSibling,v=h.firstChild,m=h.nextSibling,b=m.firstChild,x=m.nextSibling,w=x.nextSibling,k=w.firstChild,$=w.nextSibling,S=$.firstChild,C=$.nextSibling,E=C.nextSibling,q=E.firstChild,M=E.nextSibling,F=M.firstChild,L=M.nextSibling,D=L.nextSibling,T=D.firstChild,z=D.nextSibling,A=z.firstChild,O=z.nextSibling,I=O.nextSibling,P=I.firstChild,K=I.nextSibling,R=K.firstChild,B=K.nextSibling,G=B.firstChild.nextSibling.nextSibling.nextSibling,U=G.nextSibling,H=B.nextSibling,V=H.firstChild,j=H.nextSibling,N=j.firstChild,W=j.nextSibling,Q=W.firstChild,_=Q.nextSibling,X=_.nextSibling.firstChild,Z=X.nextSibling,Y=Z.nextSibling,J=Y.nextSibling,ee=J.nextSibling,te=ee.nextSibling,ne=te.nextSibling,re=ne.nextSibling,oe=re.nextSibling,ie=oe.nextSibling,se=ie.nextSibling,ae=se.nextSibling,le=W.nextSibling,de=le.firstChild,ce=le.nextSibling,ue=ce.firstChild,ge=ce.nextSibling,fe=ge.firstChild,pe=fe.nextSibling,he=ge.nextSibling,ye=he.firstChild,ve=he.nextSibling,me=ve.firstChild,be=ve.nextSibling,xe=be.firstChild,we=xe.nextSibling,ke=we.nextSibling,$e=ke.nextSibling,Se=$e.nextSibling,Ce=Se.nextSibling,Ee=Ce.nextSibling,qe=Ee.nextSibling,Me=qe.nextSibling,Fe=Me.nextSibling,Le=Fe.nextSibling,De=Le.nextSibling,Te=De.nextSibling,ze=Te.nextSibling,Ae=ze.nextSibling,Oe=Ae.nextSibling,Ie=Oe.nextSibling,Pe=Ie.nextSibling,a(n,"id",`a-${e}`),a(r,"fill",`url(#a-${e})`),a(i,"id",`am-${e}`),a(s,"id",`b-${e}`),a(l,"filter",`url(#am-${e})`),a(d,"mask",`url(#b-${e})`),a(u,"id",`ah-${e}`),a(g,"id",`k-${e}`),a(f,"filter",`url(#ah-${e})`),a(p,"mask",`url(#k-${e})`),a(v,"id",`ae-${e}`),a(m,"id",`j-${e}`),a(b,"filter",`url(#ae-${e})`),a(x,"mask",`url(#j-${e})`),a(k,"id",`ai-${e}`),a($,"id",`i-${e}`),a(S,"filter",`url(#ai-${e})`),a(C,"mask",`url(#i-${e})`),a(q,"id",`aj-${e}`),a(M,"id",`h-${e}`),a(F,"filter",`url(#aj-${e})`),a(L,"mask",`url(#h-${e})`),a(T,"id",`ag-${e}`),a(z,"id",`g-${e}`),a(A,"filter",`url(#ag-${e})`),a(O,"mask",`url(#g-${e})`),a(P,"id",`af-${e}`),a(K,"id",`f-${e}`),a(R,"filter",`url(#af-${e})`),a(B,"mask",`url(#f-${e})`),a(G,"id",`m-${e}`),a(U,"fill",`url(#m-${e})`),a(V,"id",`ak-${e}`),a(j,"id",`e-${e}`),a(N,"filter",`url(#ak-${e})`),a(W,"mask",`url(#e-${e})`),a(Q,"id",`n-${e}`),a(_,"fill",`url(#n-${e})`),a(X,"id",`r-${e}`),a(Z,"fill",`url(#r-${e})`),a(Y,"id",`s-${e}`),a(J,"fill",`url(#s-${e})`),a(ee,"id",`q-${e}`),a(te,"fill",`url(#q-${e})`),a(ne,"id",`p-${e}`),a(re,"fill",`url(#p-${e})`),a(oe,"id",`o-${e}`),a(ie,"fill",`url(#o-${e})`),a(se,"id",`l-${e}`),a(ae,"fill",`url(#l-${e})`),a(de,"id",`al-${e}`),a(ce,"id",`d-${e}`),a(ue,"filter",`url(#al-${e})`),a(ge,"mask",`url(#d-${e})`),a(fe,"id",`u-${e}`),a(pe,"fill",`url(#u-${e})`),a(ye,"id",`ad-${e}`),a(ve,"id",`c-${e}`),a(me,"filter",`url(#ad-${e})`),a(be,"mask",`url(#c-${e})`),a(xe,"id",`t-${e}`),a(we,"fill",`url(#t-${e})`),a(ke,"id",`v-${e}`),a($e,"stroke",`url(#v-${e})`),a(Se,"id",`aa-${e}`),a(Ce,"stroke",`url(#aa-${e})`),a(Ee,"id",`w-${e}`),a(qe,"stroke",`url(#w-${e})`),a(Me,"id",`ac-${e}`),a(Fe,"stroke",`url(#ac-${e})`),a(Le,"id",`ab-${e}`),a(De,"stroke",`url(#ab-${e})`),a(Te,"id",`y-${e}`),a(ze,"stroke",`url(#y-${e})`),a(Ae,"id",`x-${e}`),a(Oe,"stroke",`url(#x-${e})`),a(Ie,"id",`z-${e}`),a(Pe,"stroke",`url(#z-${e})`),t;var t,n,r,o,i,s,l,d,c,u,g,f,p,h,v,m,b,x,w,k,$,S,C,E,q,M,F,L,D,T,z,A,O,I,P,K,R,B,G,U,H,V,j,N,W,Q,_,X,Z,Y,J,ee,te,ne,re,oe,ie,se,ae,le,de,ce,ue,ge,fe,pe,he,ye,ve,me,be,xe,we,ke,$e,Se,Ce,Ee,qe,Me,Fe,Le,De,Te,ze,Ae,Oe,Ie,Pe}var Rs=d('<span><svg width=16 height=16 viewBox="0 0 16 16"fill=none xmlns=http://www.w3.org/2000/svg><path d="M6 12L10 8L6 4"stroke-width=2 stroke-linecap=round stroke-linejoin=round>'),Bs=d('<button title="Copy object to clipboard">'),Gs=d('<button title="Remove all items"aria-label="Remove all items">'),Us=d('<button title="Delete item"aria-label="Delete item">'),Hs=d('<button title="Toggle value"aria-label="Toggle value">'),Vs=d('<button title="Bulk Edit Data"aria-label="Bulk Edit Data">'),js=d("<div>"),Ns=d("<div><button> <span></span> <span> "),Ws=d("<input>"),Qs=d("<span>"),_s=d("<div><span>:"),Xs=d("<div><div><button> [<!>...<!>]");var Zs=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?sa(n):ia(n));return o=Rs(),W(()=>q(o,Ge(r().expander,n`
          transform: rotate(${e.expanded?90:0}deg);
        `,e.expanded&&n`
            & svg {
              top: -1px;
            }
          `))),o;var o},Ys=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?sa(n):ia(n)),[o,i]=N("NoCopy");return s=Bs(),A(s,"click","NoCopy"===o()?()=>{navigator.clipboard.writeText(R(e.value)).then(()=>{i("SuccessCopy"),setTimeout(()=>{i("NoCopy")},1500)},e=>{i("ErrorCopy"),setTimeout(()=>{i("NoCopy")},1500)})}:void 0,!0),f(s,O(E,{get children(){return[O(S,{get when(){return"NoCopy"===o()},get children(){return O(Ms,{})}}),O(S,{get when(){return"SuccessCopy"===o()},get children(){return O(Ls,{get theme(){return t()}})}}),O(S,{get when(){return"ErrorCopy"===o()},get children(){return O(Ds,{})}})]}})),W(e=>{var t=r().actionButton,n="NoCopy"===o()?"Copy object to clipboard":"SuccessCopy"===o()?"Object copied to clipboard":"Error copying object to clipboard";return t!==e.e&&q(s,e.e=t),n!==e.t&&a(s,"aria-label",e.t=n),e},{e:void 0,t:void 0}),s;var s},Js=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?sa(n):ia(n)),o=de().client;return(i=Gs()).$$click=()=>{const t=e.activeQuery.state.data,n=x(t,e.dataPath,[]);o.setQueryData(e.activeQuery.queryKey,n)},f(i,O(Ts,{})),W(()=>q(i,r().actionButton)),i;var i},ea=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?sa(n):ia(n)),o=de().client;return(i=Us()).$$click=()=>{const t=e.activeQuery.state.data,n=j(t,e.dataPath);o.setQueryData(e.activeQuery.queryKey,n)},f(i,O(hs,{})),W(()=>q(i,Ge(r().actionButton))),i;var i},ta=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?sa(n):ia(n)),o=de().client;return(i=Hs()).$$click=()=>{const t=e.activeQuery.state.data,n=x(t,e.dataPath,!e.value);o.setQueryData(e.activeQuery.queryKey,n)},f(i,O(zs,{get theme(){return t()},get checked(){return e.value}})),W(()=>q(i,Ge(r().actionButton,n`
          width: ${Vi.size[3.5]};
          height: ${Vi.size[3.5]};
        `))),i;var i};function na(e){return Symbol.iterator in e}function ra(e){const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?sa(n):ia(n)),o=de().client,[i,s]=N((e.defaultExpanded||[]).includes(e.label)),[l,d]=N([]),c=V(()=>Array.isArray(e.value)?e.value.map((e,t)=>({label:t.toString(),value:e})):null!==e.value&&"object"==typeof e.value&&na(e.value)&&"function"==typeof e.value[Symbol.iterator]?e.value instanceof Map?Array.from(e.value,([e,t])=>({label:e,value:t})):Array.from(e.value,(e,t)=>({label:t.toString(),value:e})):"object"==typeof e.value&&null!==e.value?Object.entries(e.value).map(([e,t])=>({label:e,value:t})):[]),u=V(()=>Array.isArray(e.value)?"array":null!==e.value&&"object"==typeof e.value&&na(e.value)&&"function"==typeof e.value[Symbol.iterator]?"Iterable":"object"==typeof e.value&&null!==e.value?"object":typeof e.value),g=V(()=>function(e,t){let n=0;const r=[];for(;n<e.length;)r.push(e.slice(n,n+t)),n+=t;return r}(c(),100)),p=e.dataPath??[];return h=js(),f(h,O(G,{get when(){return g().length},get children(){return[(t=Ns(),n=t.firstChild,o=n.firstChild,a=o.nextSibling,h=a.nextSibling.nextSibling,y=h.firstChild,n.$$click=()=>s(e=>!e),f(n,O(Zs,{get expanded(){return i()}}),o),f(a,()=>e.label),f(h,()=>"iterable"===String(u()).toLowerCase()?"(Iterable) ":"",y),f(h,()=>c().length,y),f(h,()=>c().length>1?"items":"item",null),f(t,O(G,{get when(){return e.editable},get children(){var t=js();return f(t,O(Ys,{get value(){return e.value}}),null),f(t,O(G,{get when(){return e.itemsDeletable&&void 0!==e.activeQuery},get children(){return O(ea,{get activeQuery(){return e.activeQuery},dataPath:p})}}),null),f(t,O(G,{get when(){return"array"===u()&&void 0!==e.activeQuery},get children(){return O(Js,{get activeQuery(){return e.activeQuery},dataPath:p})}}),null),f(t,O(G,{get when(){return V(()=>!!e.onEdit)()&&!m(e.value).meta},get children(){var t=Vs();return t.$$click=()=>{e.onEdit?.()},f(t,O(Fs,{})),W(()=>q(t,r().actionButton)),t}}),null),W(()=>q(t,r().actions)),t}}),null),W(e=>{var o=r().expanderButtonContainer,i=r().expanderButton,s=r().info;return o!==e.e&&q(t,e.e=o),i!==e.t&&q(n,e.t=i),s!==e.a&&q(h,e.a=s),e},{e:void 0,t:void 0,a:void 0}),t),O(G,{get when(){return i()},get children(){return[O(G,{get when(){return 1===g().length},get children(){var t=js();return f(t,O(Je,{get each(){return c()},by:e=>e.label,children:t=>O(ra,{get defaultExpanded(){return e.defaultExpanded},get label(){return t().label},get value(){return t().value},get editable(){return e.editable},get dataPath(){return[...p,t().label]},get activeQuery(){return e.activeQuery},get itemsDeletable(){return"array"===u()||"Iterable"===u()||"object"===u()}})})),W(()=>q(t,r().subEntry)),t}}),O(G,{get when(){return g().length>1},get children(){var t=js();return f(t,O(D,{get each(){return g()},children:(t,n)=>{return o=Xs(),i=o.firstChild,s=i.firstChild,a=s.firstChild,c=a.nextSibling,(u=c.nextSibling.nextSibling).nextSibling,s.$$click=()=>d(e=>e.includes(n)?e.filter(e=>e!==n):[...e,n]),f(s,O(Zs,{get expanded(){return l().includes(n)}}),a),f(s,100*n,c),f(s,100*n+100-1,u),f(i,O(G,{get when(){return l().includes(n)},get children(){var n=js();return f(n,O(Je,{get each(){return t()},by:e=>e.label,children:t=>O(ra,{get defaultExpanded(){return e.defaultExpanded},get label(){return t().label},get value(){return t().value},get editable(){return e.editable},get dataPath(){return[...p,t().label]},get activeQuery(){return e.activeQuery}})})),W(()=>q(n,r().subEntry)),n}}),null),W(e=>{var t=r().entry,n=r().expanderButton;return t!==e.e&&q(i,e.e=t),n!==e.t&&q(s,e.t=n),e},{e:void 0,t:void 0}),o;var o,i,s,a,c,u}})),W(()=>q(t,r().subEntry)),t}})]}})];var t,n,o,a,h,y}}),null),f(h,O(G,{get when(){return 0===g().length},get children(){var t=_s(),n=t.firstChild,i=n.firstChild;return f(n,()=>e.label,i),f(t,O(G,{get when(){return V(()=>!(!e.editable||void 0===e.activeQuery))()&&("string"===u()||"number"===u()||"boolean"===u())},get fallback(){return t=Qs(),f(t,()=>v(e.value)),W(()=>q(t,r().value)),t;var t},get children(){return[O(G,{get when(){return V(()=>!(!e.editable||void 0===e.activeQuery))()&&("string"===u()||"number"===u())},get children(){var t=Ws();return t.addEventListener("change",t=>{const n=e.activeQuery.state.data,r=x(n,p,"number"===u()?t.target.valueAsNumber:t.target.value);o.setQueryData(e.activeQuery.queryKey,r)}),W(e=>{var n="number"===u()?"number":"text",o=Ge(r().value,r().editableInput);return n!==e.e&&a(t,"type",e.e=n),o!==e.t&&q(t,e.t=o),e},{e:void 0,t:void 0}),W(()=>t.value=e.value),t}}),O(G,{get when(){return"boolean"===u()},get children(){var t=Qs();return f(t,O(ta,{get activeQuery(){return e.activeQuery},dataPath:p,get value(){return e.value}}),null),f(t,()=>v(e.value),null),W(()=>q(t,Ge(r().value,r().actions,r().editableInput))),t}})]}}),null),f(t,O(G,{get when(){return e.editable&&e.itemsDeletable&&void 0!==e.activeQuery},get children(){return O(ea,{get activeQuery(){return e.activeQuery},dataPath:p})}}),null),W(e=>{var o=r().row,i=r().label;return o!==e.e&&q(t,e.e=o),i!==e.t&&q(n,e.t=i),e},{e:void 0,t:void 0}),t}}),null),W(()=>q(h,r().entry)),h;var h}var oa=(e,t)=>{const{colors:n,font:r,size:o,border:i}=Vi,s=(t,n)=>"light"===e?t:n;return{entry:t`
      & * {
        font-size: ${r.size.xs};
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
      }
      position: relative;
      outline: none;
      word-break: break-word;
    `,subEntry:t`
      margin: 0 0 0 0.5em;
      padding-left: 0.75em;
      border-left: 2px solid ${s(n.gray[300],n.darkGray[400])};
      /* outline: 1px solid ${n.teal[400]}; */
    `,expander:t`
      & path {
        stroke: ${n.gray[400]};
      }
      & svg {
        width: ${o[3]};
        height: ${o[3]};
      }
      display: inline-flex;
      align-items: center;
      transition: all 0.1s ease;
      /* outline: 1px solid ${n.blue[400]}; */
    `,expanderButtonContainer:t`
      display: flex;
      align-items: center;
      line-height: ${o[4]};
      min-height: ${o[4]};
      gap: ${o[2]};
    `,expanderButton:t`
      cursor: pointer;
      color: inherit;
      font: inherit;
      outline: inherit;
      height: ${o[5]};
      background: transparent;
      border: none;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: ${o[1]};
      position: relative;
      /* outline: 1px solid ${n.green[400]}; */

      &:focus-visible {
        border-radius: ${i.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }

      & svg {
        position: relative;
        left: 1px;
      }
    `,info:t`
      color: ${s(n.gray[500],n.gray[500])};
      font-size: ${r.size.xs};
      margin-left: ${o[1]};
      /* outline: 1px solid ${n.yellow[400]}; */
    `,label:t`
      color: ${s(n.gray[700],n.gray[300])};
      white-space: nowrap;
    `,value:t`
      color: ${s(n.purple[600],n.purple[400])};
      flex-grow: 1;
    `,actions:t`
      display: inline-flex;
      gap: ${o[2]};
      align-items: center;
    `,row:t`
      display: inline-flex;
      gap: ${o[2]};
      width: 100%;
      margin: ${o[.25]} 0px;
      line-height: ${o[4.5]};
      align-items: center;
    `,editableInput:t`
      border: none;
      padding: ${o[.5]} ${o[1]} ${o[.5]} ${o[1.5]};
      flex-grow: 1;
      border-radius: ${i.radius.xs};
      background-color: ${s(n.gray[200],n.darkGray[500])};

      &:hover {
        background-color: ${s(n.gray[300],n.darkGray[600])};
      }
    `,actionButton:t`
      background-color: transparent;
      color: ${s(n.gray[500],n.gray[500])};
      border: none;
      display: inline-flex;
      padding: 0px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      width: ${o[3]};
      height: ${o[3]};
      position: relative;
      z-index: 1;

      &:hover svg {
        color: ${s(n.gray[600],n.gray[400])};
      }

      &:focus-visible {
        border-radius: ${i.radius.xs};
        outline: 2px solid ${n.blue[800]};
        outline-offset: 2px;
      }
    `}},ia=e=>oa("light",e),sa=e=>oa("dark",e);n(["click"]);var aa=d('<div><div aria-hidden=true></div><button type=button aria-label="Open Tanstack query devtools"class=tsqd-open-btn>'),la=d("<div>"),da=d('<aside aria-label="Tanstack query devtools"><div></div><button aria-label="Close tanstack query devtools">'),ca=d("<select name=tsqd-queries-filter-sort>"),ua=d("<select name=tsqd-mutations-filter-sort>"),ga=d("<span>Asc"),fa=d("<span>Desc"),pa=d('<button aria-label="Open in picture-in-picture mode"title="Open in picture-in-picture mode">'),ha=d("<div>Settings"),ya=d("<span>Position"),va=d("<span>Top"),ma=d("<span>Bottom"),ba=d("<span>Left"),xa=d("<span>Right"),wa=d("<span>Theme"),ka=d("<span>Light"),$a=d("<span>Dark"),Sa=d("<span>System"),Ca=d("<div><div class=tsqd-queries-container>"),Ea=d("<div><div class=tsqd-mutations-container>"),qa=d('<div><div><div><button aria-label="Close Tanstack query devtools"><span>TANSTACK</span><span> v</span></button></div></div><div><div><div><input aria-label="Filter queries by query key"type=text placeholder=Filter name=tsqd-query-filter-input></div><div></div><button class=tsqd-query-filter-sort-order-btn></button></div><div><button aria-label="Clear query cache"></button><button>'),Ma=d("<option>Sort by "),Fa=d("<div class=tsqd-query-disabled-indicator>disabled"),La=d("<button><div></div><code class=tsqd-query-hash>"),Da=d("<div role=tooltip id=tsqd-status-tooltip>"),Ta=d("<span>"),za=d("<button><span></span><span>"),Aa=d("<button><span></span> Error"),Oa=d('<div><span></span>Trigger Error<select><option value=""disabled selected>'),Ia=d('<div class="tsqd-query-details-explorer-container tsqd-query-details-data-explorer">'),Pa=d("<form><textarea name=data></textarea><div><span></span><div><button type=button>Cancel</button><button>Save"),Ka=d('<div><div>Query Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span></span></div><div class=tsqd-query-details-observers-count><span>Observers:</span><span></span></div><div class=tsqd-query-details-last-updated><span>Last Updated:</span><span></span></div></div><div>Actions</div><div><button><span></span>Refetch</button><button><span></span>Invalidate</button><button><span></span>Reset</button><button><span></span>Remove</button><button><span></span> Loading</button></div><div>Data </div><div>Query Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">'),Ra=d("<option>"),Ba=d('<div><div>Mutation Details</div><div><div class=tsqd-query-details-summary><pre><code></code></pre><span></span></div><div class=tsqd-query-details-last-updated><span>Submitted At:</span><span></span></div></div><div>Variables Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Context Details</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Data Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer"></div><div>Mutations Explorer</div><div class="tsqd-query-details-explorer-container tsqd-query-details-query-explorer">'),[Ga,Ua]=N(null),[Ha,Va]=N(null),[ja,Na]=N(0),[Wa,Qa]=N(!1),_a=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?hl(n):pl(n)),o=ge(),i=V(()=>de().buttonPosition||"bottom-right"),s=V(()=>"true"===e.localStore.open||"false"!==e.localStore.open&&(de().initialIsOpen||false)),a=V(()=>e.localStore.position||de().position||oe);let l;$(()=>{const t=l.parentElement,n=e.localStore.height||500,r=e.localStore.width||500,o=a();t.style.setProperty("--tsqd-panel-height",`${"top"===o?"-":""}${n}px`),t.style.setProperty("--tsqd-panel-width",`${"left"===o?"-":""}${r}px`)}),Q(()=>{const e=()=>{const e=l.parentElement,t=getComputedStyle(e).fontSize;e.style.setProperty("--tsqd-font-size",t)};e(),window.addEventListener("focus",e),h(()=>{window.removeEventListener("focus",e)})});const d=V(()=>e.localStore.pip_open??"false");return[O(G,{get when(){return V(()=>!!o().pipWindow)()&&"true"==d()},get children(){return O(P,{get mount(){return o().pipWindow?.document.body},get children(){return O(Xa,{get children(){return O(Ja,e)}})}})}}),(c=la(),"function"==typeof l?k(l,c):l=c,f(c,O(Xe,{name:"tsqd-panel-transition",get children(){return O(G,{get when(){return V(()=>!(!s()||o().pipWindow))()&&"false"==d()},get children(){return O(Ya,{get localStore(){return e.localStore},get setLocalStore(){return e.setLocalStore}})}})}}),null),f(c,O(Xe,{name:"tsqd-button-transition",get children(){return O(G,{get when(){return!s()},get children(){var t=aa(),n=t.firstChild,o=n.nextSibling;return f(n,O(Ks,{})),o.$$click=()=>e.setLocalStore("open","true"),f(o,O(Ks,{})),W(()=>q(t,Ge(r().devtoolsBtn,r()[`devtoolsBtn-position-${i()}`],"tsqd-open-btn-container"))),t}})}}),null),W(()=>q(c,Ge(n`
            & .tsqd-panel-transition-exit-active,
            & .tsqd-panel-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
            }

            & .tsqd-panel-transition-exit-to,
            & .tsqd-panel-transition-enter {
              ${"top"===a()||"bottom"===a()?"transform: translateY(var(--tsqd-panel-height));":"transform: translateX(var(--tsqd-panel-width));"}
            }

            & .tsqd-button-transition-exit-active,
            & .tsqd-button-transition-enter-active {
              transition:
                opacity 0.3s,
                transform 0.3s;
              opacity: 1;
            }

            & .tsqd-button-transition-exit-to,
            & .tsqd-button-transition-enter {
              transform: ${"relative"===i()?"none;":"top-left"===i()?"translateX(-72px);":"top-right"===i()?"translateX(72px);":"translateY(72px);"};
              opacity: 0;
            }
          `,"tsqd-transitions-container"))),c)];var c},Xa=e=>{const t=ge(),n=pe(),r=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,o=V(()=>"dark"===n()?hl(r):pl(r));return $(()=>{const e=t().pipWindow,n=()=>{e&&Na(e.innerWidth)};e&&(e.addEventListener("resize",n),n()),h(()=>{e&&e.removeEventListener("resize",n)})}),(i=la()).style.setProperty("--tsqd-font-size","16px"),i.style.setProperty("max-height","100vh"),i.style.setProperty("height","100vh"),i.style.setProperty("width","100vw"),f(i,()=>e.children),W(()=>q(i,Ge(o().panel,(()=>{const{colors:e}=Vi,t=(e,t)=>"dark"===n()?t:e;return ja()<re?r`
        flex-direction: column;
        background-color: ${t(e.gray[300],e.gray[600])};
      `:r`
      flex-direction: row;
      background-color: ${t(e.gray[200],e.darkGray[900])};
    `})(),{[r`
            min-width: min-content;
          `]:ja()<700},"tsqd-main-panel"))),i;var i},Za=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?hl(n):pl(n));let o;Q(()=>{tt(o,({width:e},t)=>{t===o&&Na(e)})});return i=la(),"function"==typeof o?k(o,i):o=i,i.style.setProperty("--tsqd-font-size","16px"),f(i,()=>e.children),W(()=>q(i,Ge(r().parentPanel,(()=>{const{colors:e}=Vi,r=(e,n)=>"dark"===t()?n:e;return ja()<re?n`
        flex-direction: column;
        background-color: ${r(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${r(e.gray[200],e.darkGray[900])};
    `})(),{[n`
            min-width: min-content;
          `]:ja()<700},"tsqd-main-panel"))),i;var i},Ya=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?hl(n):pl(n)),[o,i]=N(!1),s=V(()=>e.localStore.position||de().position||oe),a=t=>{const n=t.currentTarget.parentElement;if(!n)return;i(!0);const{height:r,width:a}=n.getBoundingClientRect(),l=t.clientX,d=t.clientY;let c=0;const u=K(3.5),g=K(12),f=t=>{if(t.preventDefault(),"left"===s()||"right"===s()){const r="right"===s()?l-t.clientX:t.clientX-l;c=Math.round(a+r),c<g&&(c=g),e.setLocalStore("width",String(Math.round(c)));const o=n.getBoundingClientRect().width;Number(e.localStore.width)<o&&e.setLocalStore("width",String(o))}else{const n="bottom"===s()?d-t.clientY:t.clientY-d;c=Math.round(r+n),c<u&&(c=u,Ua(null)),e.setLocalStore("height",String(Math.round(c)))}},p=()=>{o()&&i(!1),document.removeEventListener("mousemove",f,!1),document.removeEventListener("mouseUp",p,!1)};document.addEventListener("mousemove",f,!1),document.addEventListener("mouseup",p,!1)};let l;Q(()=>{tt(l,({width:e},t)=>{t===l&&Na(e)})}),$(()=>{const t=l.parentElement?.parentElement?.parentElement;if(!t)return;const n=g("padding",e.localStore.position||oe),r="left"===e.localStore.position||"right"===e.localStore.position,o=(({padding:e,paddingTop:t,paddingBottom:n,paddingLeft:r,paddingRight:o})=>({padding:e,paddingTop:t,paddingBottom:n,paddingLeft:r,paddingRight:o}))(t.style);t.style[n]=`${r?e.localStore.width:e.localStore.height}px`,h(()=>{Object.entries(o).forEach(([e,n])=>{t.style[e]=n})})});return d=da(),c=d.firstChild,u=c.nextSibling,"function"==typeof l?k(l,d):l=d,c.$$mousedown=a,u.$$click=()=>e.setLocalStore("open","false"),f(u,O(ys,{})),f(d,O(Ja,e),null),W(o=>{var i=Ge(r().panel,r()[`panel-position-${s()}`],(()=>{const{colors:e}=Vi,r=(e,n)=>"dark"===t()?n:e;return ja()<re?n`
        flex-direction: column;
        background-color: ${r(e.gray[300],e.gray[600])};
      `:n`
      flex-direction: row;
      background-color: ${r(e.gray[200],e.darkGray[900])};
    `})(),{[n`
            min-width: min-content;
          `]:ja()<700&&("right"===s()||"left"===s())},"tsqd-main-panel"),a="bottom"===s()||"top"===s()?`${e.localStore.height||500}px`:"auto",l="right"===s()||"left"===s()?`${e.localStore.width||500}px`:"auto",g=Ge(r().dragHandle,r()[`dragHandle-position-${s()}`],"tsqd-drag-handle"),f=Ge(r().closeBtn,r()[`closeBtn-position-${s()}`],"tsqd-minimize-btn");return i!==o.e&&q(d,o.e=i),a!==o.t&&(null!=(o.t=a)?d.style.setProperty("height",a):d.style.removeProperty("height")),l!==o.a&&(null!=(o.a=l)?d.style.setProperty("width",l):d.style.removeProperty("width")),g!==o.o&&q(c,o.o=g),f!==o.i&&q(u,o.i=f),o},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0}),d;var d,c,u},Ja=e=>{let t;ll(),ul();const n=pe(),r=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,o=V(()=>"dark"===n()?hl(r):pl(r)),i=ge(),[s,d]=N("queries"),c=V(()=>e.localStore.sort||se),g=V(()=>Number(e.localStore.sortOrder)||1),p=V(()=>e.localStore.mutationSort||ae),h=V(()=>Number(e.localStore.mutationSortOrder)||1),y=V(()=>b[c()]),v=V(()=>l[p()]),m=V(()=>de().onlineManager),x=V(()=>de().client.getQueryCache()),w=V(()=>de().client.getMutationCache()),$=dl(e=>e().getAll().length,!1),S=V(u(()=>[$(),e.localStore.filter,c(),g()],()=>{const t=x().getAll(),n=e.localStore.filter?t.filter(t=>Ee(t.queryHash,e.localStore.filter||"").passed):[...t];return y()?n.sort((e,t)=>y()(e,t)*g()):n})),C=gl(e=>e().getAll().length,!1),E=V(u(()=>[C(),e.localStore.mutationFilter,p(),h()],()=>{const t=w().getAll(),n=e.localStore.mutationFilter?t.filter(t=>Ee(`${t.options.mutationKey?JSON.stringify(t.options.mutationKey)+" - ":""}${new Date(t.state.submittedAt).toLocaleString()}`,e.localStore.mutationFilter||"").passed):[...t];return v()?n.sort((e,t)=>v()(e,t)*h()):n})),M=t=>{e.setLocalStore("position",t)},F=e=>{const n=getComputedStyle(t).getPropertyValue("--tsqd-font-size");e.style.setProperty("--tsqd-font-size",n)};return[(D=qa(),T=D.firstChild,z=T.firstChild,A=z.firstChild,I=A.firstChild,P=I.nextSibling,K=P.firstChild,R=T.nextSibling,B=R.firstChild,U=B.firstChild,H=U.firstChild,j=U.nextSibling,Q=j.nextSibling,_=B.nextSibling,X=_.firstChild,Z=X.nextSibling,"function"==typeof t?k(t,D):t=D,A.$$click=()=>{i().pipWindow||e.showPanelViewOnly?e.onClose&&e.onClose():e.setLocalStore("open","false")},f(P,()=>de().queryFlavor,K),f(P,()=>de().version,null),f(z,O(yo.Root,{get class(){return Ge(o().viewToggle)},get value(){return s()},onChange:e=>{d(e),Ua(null),Va(null)},get children(){return[O(yo.Item,{value:"queries",class:"tsqd-radio-toggle",get children(){return[O(yo.ItemInput,{}),O(yo.ItemControl,{get children(){return O(yo.ItemIndicator,{})}}),O(yo.ItemLabel,{title:"Toggle Queries View",children:"Queries"})]}}),O(yo.Item,{value:"mutations",class:"tsqd-radio-toggle",get children(){return[O(yo.ItemInput,{}),O(yo.ItemControl,{get children(){return O(yo.ItemIndicator,{})}}),O(yo.ItemLabel,{title:"Toggle Mutations View",children:"Mutations"})]}})]}}),null),f(T,O(G,{get when(){return"queries"===s()},get children(){return O(nl,{})}}),null),f(T,O(G,{get when(){return"mutations"===s()},get children(){return O(rl,{})}}),null),f(U,O(ps,{}),H),H.$$input=t=>{"queries"===s()?e.setLocalStore("filter",t.currentTarget.value):e.setLocalStore("mutationFilter",t.currentTarget.value)},f(j,O(G,{get when(){return"queries"===s()},get children(){var t=ca();return t.addEventListener("change",t=>{e.setLocalStore("sort",t.currentTarget.value)}),f(t,()=>Object.keys(b).map(e=>{return(t=Ma()).firstChild,t.value=e,f(t,e,null),t;var t})),W(()=>t.value=c()),t}}),null),f(j,O(G,{get when(){return"mutations"===s()},get children(){var t=ua();return t.addEventListener("change",t=>{e.setLocalStore("mutationSort",t.currentTarget.value)}),f(t,()=>Object.keys(l).map(e=>{return(t=Ma()).firstChild,t.value=e,f(t,e,null),t;var t})),W(()=>t.value=p()),t}}),null),f(j,O(ys,{}),null),Q.$$click=()=>{"queries"===s()?e.setLocalStore("sortOrder",String(-1*g())):e.setLocalStore("mutationSortOrder",String(-1*h()))},f(Q,O(G,{get when(){return 1===("queries"===s()?g():h())},get children(){return[ga(),O(vs,{})]}}),null),f(Q,O(G,{get when(){return-1===("queries"===s()?g():h())},get children(){return[fa(),O(ms,{})]}}),null),X.$$click=()=>{"queries"===s()?x().clear():w().clear()},f(X,O(hs,{})),Z.$$click=()=>{Wa()?(m().setOnline(!0),Qa(!1)):(m().setOnline(!1),Qa(!0))},f(Z,(L=V(()=>!!Wa()),()=>L()?O(Cs,{}):O(Ss,{}))),f(_,O(G,{get when(){return V(()=>!i().pipWindow)()&&!i().disabled},get children(){var t=pa();return t.$$click=()=>{i().requestPipWindow(Number(window.innerWidth),Number(e.localStore.height??500))},f(t,O(qs,{})),W(()=>q(t,Ge(o().actionsBtn,"tsqd-actions-btn","tsqd-action-open-pip"))),t}}),null),f(_,O(Bi.Root,{gutter:4,get children(){return[O(Bi.Trigger,{get class(){return Ge(o().actionsBtn,"tsqd-actions-btn","tsqd-action-settings")},get children(){return O(Es,{})}}),O(Bi.Portal,{ref:e=>F(e),get mount(){return V(()=>!!i().pipWindow)()?i().pipWindow.document.body:document.body},get children(){return O(Bi.Content,{get class(){return Ge(o().settingsMenu,"tsqd-settings-menu")},get children(){return[(t=ha(),W(()=>q(t,Ge(o().settingsMenuHeader,"tsqd-settings-menu-header"))),t),O(G,{get when(){return!e.showPanelViewOnly},get children(){return O(Bi.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[O(Bi.SubTrigger,{get class(){return Ge(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-position")},get children(){return[ya(),O(ys,{})]}}),O(Bi.Portal,{ref:e=>F(e),get mount(){return V(()=>!!i().pipWindow)()?i().pipWindow.document.body:document.body},get children(){return O(Bi.SubContent,{get class(){return Ge(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[O(Bi.Item,{onSelect:()=>{M("top")},as:"button",get class(){return Ge(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-top")},get children(){return[va(),O(vs,{})]}}),O(Bi.Item,{onSelect:()=>{M("bottom")},as:"button",get class(){return Ge(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-bottom")},get children(){return[ma(),O(ms,{})]}}),O(Bi.Item,{onSelect:()=>{M("left")},as:"button",get class(){return Ge(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-left")},get children(){return[ba(),O(bs,{})]}}),O(Bi.Item,{onSelect:()=>{M("right")},as:"button",get class(){return Ge(o().settingsSubButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-right")},get children(){return[xa(),O(xs,{})]}})]}})}})]}})}}),O(Bi.Sub,{overlap:!0,gutter:8,shift:-4,get children(){return[O(Bi.SubTrigger,{get class(){return Ge(o().settingsSubTrigger,"tsqd-settings-menu-sub-trigger","tsqd-settings-menu-sub-trigger-position")},get children(){return[wa(),O(ys,{})]}}),O(Bi.Portal,{ref:e=>F(e),get mount(){return V(()=>!!i().pipWindow)()?i().pipWindow.document.body:document.body},get children(){return O(Bi.SubContent,{get class(){return Ge(o().settingsMenu,"tsqd-settings-submenu")},get children(){return[O(Bi.Item,{onSelect:()=>{e.setLocalStore("theme_preference","light")},as:"button",get class(){return Ge(o().settingsSubButton,"light"===e.localStore.theme_preference&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-top")},get children(){return[ka(),O(ws,{})]}}),O(Bi.Item,{onSelect:()=>{e.setLocalStore("theme_preference","dark")},as:"button",get class(){return Ge(o().settingsSubButton,"dark"===e.localStore.theme_preference&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-bottom")},get children(){return[$a(),O(ks,{})]}}),O(Bi.Item,{onSelect:()=>{e.setLocalStore("theme_preference","system")},as:"button",get class(){return Ge(o().settingsSubButton,"system"===e.localStore.theme_preference&&o().themeSelectedButton,"tsqd-settings-menu-position-btn","tsqd-settings-menu-position-btn-left")},get children(){return[Sa(),O($s,{})]}})]}})}})]}})];var t}})}})]}}),null),f(D,O(G,{get when(){return"queries"===s()},get children(){var e=Ca(),t=e.firstChild;return f(t,O(Je,{by:e=>e.queryHash,get each(){return S()},children:e=>O(el,{get query(){return e()}})})),W(()=>q(e,Ge(o().overflowQueryContainer,"tsqd-queries-overflow-container"))),e}}),null),f(D,O(G,{get when(){return"mutations"===s()},get children(){var e=Ea(),t=e.firstChild;return f(t,O(Je,{by:e=>e.mutationId,get each(){return E()},children:e=>O(tl,{get mutation(){return e()}})})),W(()=>q(e,Ge(o().overflowQueryContainer,"tsqd-mutations-overflow-container"))),e}}),null),W(e=>{var t=Ge(o().queriesContainer,ja()<re&&(Ga()||Ha())&&r`
              height: 50%;
              max-height: 50%;
            `,ja()<re&&!(Ga()||Ha())&&r`
              height: 100%;
              max-height: 100%;
            `,"tsqd-queries-container"),n=Ge(o().row,"tsqd-header"),i=o().logoAndToggleContainer,l=Ge(o().logo,"tsqd-text-logo-container"),d=Ge(o().tanstackLogo,"tsqd-text-logo-tanstack"),c=Ge(o().queryFlavorLogo,"tsqd-text-logo-query-flavor"),u=Ge(o().row,"tsqd-filters-actions-container"),f=Ge(o().filtersContainer,"tsqd-filters-container"),p=Ge(o().filterInput,"tsqd-query-filter-textfield-container"),y=Ge("tsqd-query-filter-textfield"),v=Ge(o().filterSelect,"tsqd-query-filter-sort-container"),m="Sort order "+(-1===("queries"===s()?g():h())?"descending":"ascending"),b=-1===("queries"===s()?g():h()),x=Ge(o().actionsContainer,"tsqd-actions-container"),w=Ge(o().actionsBtn,"tsqd-actions-btn","tsqd-action-clear-cache"),k=`Clear ${s()} cache`,$=Ge(o().actionsBtn,Wa()&&o().actionsBtnOffline,"tsqd-actions-btn","tsqd-action-mock-offline-behavior"),S=Wa()?"Unset offline mocking behavior":"Mock offline behavior",C=Wa(),E=Wa()?"Unset offline mocking behavior":"Mock offline behavior";return t!==e.e&&q(D,e.e=t),n!==e.t&&q(T,e.t=n),i!==e.a&&q(z,e.a=i),l!==e.o&&q(A,e.o=l),d!==e.i&&q(I,e.i=d),c!==e.n&&q(P,e.n=c),u!==e.s&&q(R,e.s=u),f!==e.h&&q(B,e.h=f),p!==e.r&&q(U,e.r=p),y!==e.d&&q(H,e.d=y),v!==e.l&&q(j,e.l=v),m!==e.u&&a(Q,"aria-label",e.u=m),b!==e.c&&a(Q,"aria-pressed",e.c=b),x!==e.w&&q(_,e.w=x),w!==e.m&&q(X,e.m=w),k!==e.f&&a(X,"title",e.f=k),$!==e.y&&q(Z,e.y=$),S!==e.g&&a(Z,"aria-label",e.g=S),C!==e.p&&a(Z,"aria-pressed",e.p=C),E!==e.b&&a(Z,"title",e.b=E),e},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0}),W(()=>H.value="queries"===s()?e.localStore.filter||"":e.localStore.mutationFilter||""),D),O(G,{get when(){return V(()=>"queries"===s())()&&Ga()},get children(){return O(il,{})}}),O(G,{get when(){return V(()=>"mutations"===s())()&&Ha()},get children(){return O(sl,{})}})];var L,D,T,z,A,I,P,K,R,B,U,H,j,Q,_,X,Z},el=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?hl(n):pl(n)),{colors:o,alpha:i}=Vi,s=(e,n)=>"dark"===t()?n:e,l=dl(t=>t().find({queryKey:e.query.queryKey})?.state,!0,t=>t.query.queryHash===e.query.queryHash),d=dl(t=>t().find({queryKey:e.query.queryKey})?.isDisabled()??!1,!0,t=>t.query.queryHash===e.query.queryHash),c=dl(t=>t().find({queryKey:e.query.queryKey})?.isStale()??!1,!0,t=>t.query.queryHash===e.query.queryHash),u=dl(t=>t().find({queryKey:e.query.queryKey})?.getObserversCount()??0,!0,t=>t.query.queryHash===e.query.queryHash),g=V(()=>z({queryState:l(),observerCount:u(),isStale:c()}));return O(G,{get when(){return l()},get children(){var t=La(),l=t.firstChild,c=l.nextSibling;return t.$$click=()=>Ua(e.query.queryHash===Ga()?null:e.query.queryHash),f(l,u),f(c,()=>e.query.queryHash),f(t,O(G,{get when(){return d()},get children(){return Fa()}}),null),W(d=>{var c=Ge(r().queryRow,Ga()===e.query.queryHash&&r().selectedQueryRow,"tsqd-query-row"),u=`Query key ${e.query.queryHash}`,f=Ge("gray"===g()?n`
        background-color: ${s(o[g()][200],o[g()][700])};
        color: ${s(o[g()][700],o[g()][300])};
      `:n`
      background-color: ${s(o[g()][200]+i[80],o[g()][900])};
      color: ${s(o[g()][800],o[g()][300])};
    `,"tsqd-query-observer-count");return c!==d.e&&q(t,d.e=c),u!==d.t&&a(t,"aria-label",d.t=u),f!==d.a&&q(l,d.a=f),d},{e:void 0,t:void 0,a:void 0}),t}})},tl=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?hl(n):pl(n)),{colors:i,alpha:s}=Vi,l=(e,n)=>"dark"===t()?n:e,d=gl(t=>t().getAll().find(t=>t.mutationId===e.mutation.mutationId)?.state),c=gl(t=>{const n=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return!!n&&n.state.isPaused}),u=gl(t=>{const n=t().getAll().find(t=>t.mutationId===e.mutation.mutationId);return n?n.state.status:"idle"}),g=V(()=>o({isPaused:c(),status:u()}));return O(G,{get when(){return d()},get children(){var t=La(),o=t.firstChild,d=o.nextSibling;return t.$$click=()=>{Va(e.mutation.mutationId===Ha()?null:e.mutation.mutationId)},f(o,O(G,{get when(){return"purple"===g()},get children(){return O(Ps,{})}}),null),f(o,O(G,{get when(){return"green"===g()},get children(){return O(As,{})}}),null),f(o,O(G,{get when(){return"red"===g()},get children(){return O(Is,{})}}),null),f(o,O(G,{get when(){return"yellow"===g()},get children(){return O(Os,{})}}),null),f(d,O(G,{get when(){return e.mutation.options.mutationKey},get children(){return[V(()=>JSON.stringify(e.mutation.options.mutationKey))," -"," "]}}),null),f(d,()=>new Date(e.mutation.state.submittedAt).toLocaleString(),null),W(d=>{var c=Ge(r().queryRow,Ha()===e.mutation.mutationId&&r().selectedQueryRow,"tsqd-query-row"),u=`Mutation submitted at ${new Date(e.mutation.state.submittedAt).toLocaleString()}`,f=Ge("gray"===g()?n`
        background-color: ${l(i[g()][200],i[g()][700])};
        color: ${l(i[g()][700],i[g()][300])};
      `:n`
      background-color: ${l(i[g()][200]+s[80],i[g()][900])};
      color: ${l(i[g()][800],i[g()][300])};
    `,"tsqd-query-observer-count");return c!==d.e&&q(t,d.e=c),u!==d.t&&a(t,"aria-label",d.t=u),f!==d.a&&q(o,d.a=f),d},{e:void 0,t:void 0,a:void 0}),t}})},nl=()=>{const e=dl(e=>e().getAll().filter(e=>"stale"===T(e)).length),t=dl(e=>e().getAll().filter(e=>"fresh"===T(e)).length),n=dl(e=>e().getAll().filter(e=>"fetching"===T(e)).length),r=dl(e=>e().getAll().filter(e=>"paused"===T(e)).length),o=dl(e=>e().getAll().filter(e=>"inactive"===T(e)).length),i=pe(),s=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,a=V(()=>"dark"===i()?hl(s):pl(s));return l=la(),f(l,O(ol,{label:"Fresh",color:"green",get count(){return t()}}),null),f(l,O(ol,{label:"Fetching",color:"blue",get count(){return n()}}),null),f(l,O(ol,{label:"Paused",color:"purple",get count(){return r()}}),null),f(l,O(ol,{label:"Stale",color:"yellow",get count(){return e()}}),null),f(l,O(ol,{label:"Inactive",color:"gray",get count(){return o()}}),null),W(()=>q(l,Ge(a().queryStatusContainer,"tsqd-query-status-container"))),l;var l},rl=()=>{const e=gl(e=>e().getAll().filter(e=>"green"===o({isPaused:e.state.isPaused,status:e.state.status})).length),t=gl(e=>e().getAll().filter(e=>"yellow"===o({isPaused:e.state.isPaused,status:e.state.status})).length),n=gl(e=>e().getAll().filter(e=>"purple"===o({isPaused:e.state.isPaused,status:e.state.status})).length),r=gl(e=>e().getAll().filter(e=>"red"===o({isPaused:e.state.isPaused,status:e.state.status})).length),i=pe(),s=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,a=V(()=>"dark"===i()?hl(s):pl(s));return l=la(),f(l,O(ol,{label:"Paused",color:"purple",get count(){return n()}}),null),f(l,O(ol,{label:"Pending",color:"yellow",get count(){return t()}}),null),f(l,O(ol,{label:"Success",color:"green",get count(){return e()}}),null),f(l,O(ol,{label:"Error",color:"red",get count(){return r()}}),null),W(()=>q(l,Ge(a().queryStatusContainer,"tsqd-query-status-container"))),l;var l},ol=e=>{const t=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===t()?hl(n):pl(n)),{colors:o,alpha:s}=Vi,a=(e,n)=>"dark"===t()?n:e;let l;const[d,u]=N(!1),[g,p]=N(!1),h=V(()=>!(Ga()&&ja()<1024&&ja()>re)&&!(ja()<re));return y=za(),v=y.firstChild,m=v.nextSibling,"function"==typeof l?k(l,y):l=y,y.addEventListener("mouseleave",()=>{u(!1),p(!1)}),y.addEventListener("mouseenter",()=>u(!0)),y.addEventListener("blur",()=>p(!1)),y.addEventListener("focus",()=>p(!0)),c(y,i({get disabled(){return h()},get class(){return Ge(r().queryStatusTag,!h()&&n`
            cursor: pointer;
            &:hover {
              background: ${a(o.gray[200],o.darkGray[400])}${s[80]};
            }
          `,"tsqd-query-status-tag",`tsqd-query-status-tag-${e.label.toLowerCase()}`)}},()=>d()||g()?{"aria-describedby":"tsqd-status-tooltip"}:{}),!1,!0),f(y,O(G,{get when(){return V(()=>!h())()&&(d()||g())},get children(){var t=Da();return f(t,()=>e.label),W(()=>q(t,Ge(r().statusTooltip,"tsqd-query-status-tooltip"))),t}}),v),f(y,O(G,{get when(){return h()},get children(){var t=Ta();return f(t,()=>e.label),W(()=>q(t,Ge(r().queryStatusTagLabel,"tsqd-query-status-tag-label"))),t}}),m),f(m,()=>e.count),W(t=>{var i=Ge(n`
            width: ${Vi.size[1.5]};
            height: ${Vi.size[1.5]};
            border-radius: ${Vi.border.radius.full};
            background-color: ${Vi.colors[e.color][500]};
          `,"tsqd-query-status-tag-dot"),s=Ge(r().queryStatusCount,e.count>0&&"gray"!==e.color&&n`
              background-color: ${a(o[e.color][100],o[e.color][900])};
              color: ${a(o[e.color][700],o[e.color][300])};
            `,"tsqd-query-status-tag-count");return i!==t.e&&q(v,t.e=i),s!==t.t&&q(m,t.t=s),t},{e:void 0,t:void 0}),y;var y,v,m},il=()=>{const e=pe(),n=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,r=V(()=>"dark"===e()?hl(n):pl(n)),{colors:o}=Vi,i=(t,n)=>"dark"===e()?n:t,s=de().client,[l,d]=N(!1),[c,u]=N("view"),[g,p]=N(!1),h=V(()=>de().errorTypes||[]),y=dl(e=>e().getAll().find(e=>e.queryHash===Ga()),!1),m=dl(e=>e().getAll().find(e=>e.queryHash===Ga()),!1),b=dl(e=>e().getAll().find(e=>e.queryHash===Ga())?.state,!1),x=dl(e=>e().getAll().find(e=>e.queryHash===Ga())?.state.data,!1),w=dl(e=>{const t=e().getAll().find(e=>e.queryHash===Ga());return t?T(t):"inactive"}),k=dl(e=>{const t=e().getAll().find(e=>e.queryHash===Ga());return t?t.state.status:"pending"}),S=dl(e=>e().getAll().find(e=>e.queryHash===Ga())?.getObserversCount()??0),C=V(()=>t(w())),E=()=>{(y()?.fetch())?.catch(()=>{})},M=e=>{const t=e?.initializer(y())??new Error("Unknown error from devtools"),n=y().options;y().setState({status:"error",error:t,fetchMeta:{...y().state.fetchMeta,__previousQueryOptions:n}})};$(()=>{"fetching"!==w()&&d(!1)});return O(G,{get when(){return V(()=>!!y())()&&b()},get children(){var e=Ka(),t=e.firstChild,$=t.nextSibling,F=$.firstChild,L=F.firstChild,D=L.firstChild,T=L.nextSibling,z=F.nextSibling,A=z.firstChild.nextSibling,I=z.nextSibling.firstChild.nextSibling,P=$.nextSibling,K=P.nextSibling,R=K.firstChild,U=R.firstChild,H=R.nextSibling,V=H.firstChild,j=H.nextSibling,N=j.firstChild,Q=j.nextSibling,_=Q.firstChild,X=Q.nextSibling,Z=X.firstChild,Y=Z.nextSibling,J=K.nextSibling;J.firstChild;var ee=J.nextSibling,te=ee.nextSibling;return f(D,()=>v(y().queryKey,!0)),f(T,w),f(A,S),f(I,()=>new Date(b().dataUpdatedAt).toLocaleTimeString()),R.$$click=E,H.$$click=()=>s.invalidateQueries(y()),j.$$click=()=>s.resetQueries(y()),Q.$$click=()=>{s.removeQueries(y()),Ua(null)},X.$$click=()=>{if(void 0===y()?.state.data)d(!0),(()=>{const e=y(),t=e.state,n=e.state.fetchMeta?e.state.fetchMeta.__previousQueryOptions:null;e.cancel({silent:!0}),e.setState({...t,fetchStatus:"idle",fetchMeta:null}),n&&e.fetch(n)})();else{const e=y();if(!e)return;const t=e.options;e.fetch({...t,queryFn:()=>new Promise(()=>{}),gcTime:-1}),e.setState({data:void 0,status:"pending",fetchMeta:{...e.state.fetchMeta,__previousQueryOptions:t}})}},f(X,()=>"pending"===k()?"Restore":"Trigger",Y),f(K,O(G,{get when(){return 0===h().length||"error"===k()},get children(){var e=Aa(),t=e.firstChild,r=t.nextSibling;return e.$$click=()=>{y().state.error?s.resetQueries(y()):M()},f(e,()=>"error"===k()?"Restore":"Trigger",r),W(r=>{var s=Ge(n`
                  color: ${i(o.red[500],o.red[400])};
                `,"tsqd-query-details-actions-btn","tsqd-query-details-action-error"),a="pending"===k(),l=n`
                  background-color: ${i(o.red[500],o.red[400])};
                `;return s!==r.e&&q(e,r.e=s),a!==r.t&&(e.disabled=r.t=a),l!==r.a&&q(t,r.a=l),r},{e:void 0,t:void 0,a:void 0}),e}}),null),f(K,O(G,{get when(){return!(0===h().length||"error"===k())},get children(){var e=Oa(),t=e.firstChild,o=t.nextSibling.nextSibling;return o.firstChild,o.addEventListener("change",e=>{const t=h().find(t=>t.name===e.currentTarget.value);M(t)}),f(o,O(B,{get each(){return h()},children:e=>{return t=Ra(),f(t,()=>e.name),W(()=>t.value=e.name),t;var t}}),null),f(e,O(ys,{}),null),W(i=>{var s=Ge(r().actionsSelect,"tsqd-query-details-actions-btn","tsqd-query-details-action-error-multiple"),a=n`
                  background-color: ${Vi.colors.red[400]};
                `,l="pending"===k();return s!==i.e&&q(e,i.e=s),a!==i.t&&q(t,i.t=a),l!==i.a&&(o.disabled=i.a=l),i},{e:void 0,t:void 0,a:void 0}),e}}),null),f(J,()=>"view"===c()?"Explorer":"Editor",null),f(e,O(G,{get when(){return"view"===c()},get children(){var e=Ia();return f(e,O(ra,{label:"Data",defaultExpanded:["Data"],get value(){return x()},editable:!0,onEdit:()=>u("edit"),get activeQuery(){return y()}})),W(t=>null!=(t=Vi.size[2])?e.style.setProperty("padding",t):e.style.removeProperty("padding")),e}}),ee),f(e,O(G,{get when(){return"edit"===c()},get children(){var e=Pa(),t=e.firstChild,s=t.nextSibling,l=s.firstChild,d=l.nextSibling,c=d.firstChild,h=c.nextSibling;return e.addEventListener("submit",e=>{e.preventDefault();const t=new FormData(e.currentTarget).get("data");try{const e=JSON.parse(t);y().setState({...y().state,data:e}),u("view")}catch(n){p(!0)}}),t.addEventListener("focus",()=>p(!1)),f(l,()=>g()?"Invalid Value":""),c.$$click=()=>u("view"),W(u=>{var f=Ge(r().devtoolsEditForm,"tsqd-query-details-data-editor"),p=r().devtoolsEditTextarea,y=g(),v=r().devtoolsEditFormActions,m=r().devtoolsEditFormError,b=r().devtoolsEditFormActionContainer,x=Ge(r().devtoolsEditFormAction,n`
                      color: ${i(o.gray[600],o.gray[300])};
                    `),w=Ge(r().devtoolsEditFormAction,n`
                      color: ${i(o.blue[600],o.blue[400])};
                    `);return f!==u.e&&q(e,u.e=f),p!==u.t&&q(t,u.t=p),y!==u.a&&a(t,"data-error",u.a=y),v!==u.o&&q(s,u.o=v),m!==u.i&&q(l,u.i=m),b!==u.n&&q(d,u.n=b),x!==u.s&&q(c,u.s=x),w!==u.h&&q(h,u.h=w),u},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0}),W(()=>t.value=JSON.stringify(x(),null,2)),e}}),ee),f(te,O(ra,{label:"Query",defaultExpanded:["Query","queryKey"],get value(){return m()}})),W(s=>{var a=Ge(r().detailsContainer,"tsqd-query-details-container"),d=Ge(r().detailsHeader,"tsqd-query-details-header"),c=Ge(r().detailsBody,"tsqd-query-details-summary-container"),u=Ge(r().queryDetailsStatus,"gray"===C()?n`
        background-color: ${i(o[C()][200],o[C()][700])};
        color: ${i(o[C()][700],o[C()][300])};
        border-color: ${i(o[C()][400],o[C()][600])};
      `:n`
      background-color: ${i(o[C()][100],o[C()][900])};
      color: ${i(o[C()][700],o[C()][300])};
      border-color: ${i(o[C()][400],o[C()][600])};
    `),g=Ge(r().detailsHeader,"tsqd-query-details-header"),f=Ge(r().actionsBody,"tsqd-query-details-actions-container"),p=Ge(n`
                color: ${i(o.blue[600],o.blue[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-refetch"),h="fetching"===w(),y=n`
                background-color: ${i(o.blue[600],o.blue[400])};
              `,v=Ge(n`
                color: ${i(o.yellow[600],o.yellow[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-invalidate"),m="pending"===k(),b=n`
                background-color: ${i(o.yellow[600],o.yellow[400])};
              `,x=Ge(n`
                color: ${i(o.gray[600],o.gray[300])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-reset"),S="pending"===k(),E=n`
                background-color: ${i(o.gray[600],o.gray[400])};
              `,M=Ge(n`
                color: ${i(o.pink[500],o.pink[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-remove"),F="fetching"===w(),L=n`
                background-color: ${i(o.pink[500],o.pink[400])};
              `,D=Ge(n`
                color: ${i(o.cyan[500],o.cyan[400])};
              `,"tsqd-query-details-actions-btn","tsqd-query-details-action-loading"),z=l(),A=n`
                background-color: ${i(o.cyan[500],o.cyan[400])};
              `,O=Ge(r().detailsHeader,"tsqd-query-details-header"),I=Ge(r().detailsHeader,"tsqd-query-details-header"),B=Vi.size[2];return a!==s.e&&q(e,s.e=a),d!==s.t&&q(t,s.t=d),c!==s.a&&q($,s.a=c),u!==s.o&&q(T,s.o=u),g!==s.i&&q(P,s.i=g),f!==s.n&&q(K,s.n=f),p!==s.s&&q(R,s.s=p),h!==s.h&&(R.disabled=s.h=h),y!==s.r&&q(U,s.r=y),v!==s.d&&q(H,s.d=v),m!==s.l&&(H.disabled=s.l=m),b!==s.u&&q(V,s.u=b),x!==s.c&&q(j,s.c=x),S!==s.w&&(j.disabled=s.w=S),E!==s.m&&q(N,s.m=E),M!==s.f&&q(Q,s.f=M),F!==s.y&&(Q.disabled=s.y=F),L!==s.g&&q(_,s.g=L),D!==s.p&&q(X,s.p=D),z!==s.b&&(X.disabled=s.b=z),A!==s.T&&q(Z,s.T=A),O!==s.A&&q(J,s.A=O),I!==s.O&&q(ee,s.O=I),B!==s.I&&(null!=(s.I=B)?te.style.setProperty("padding",B):te.style.removeProperty("padding")),s},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0,c:void 0,w:void 0,m:void 0,f:void 0,y:void 0,g:void 0,p:void 0,b:void 0,T:void 0,A:void 0,O:void 0,I:void 0}),e}})},sl=()=>{const e=pe(),t=de().shadowDOMTarget?Re.bind({target:de().shadowDOMTarget}):Re,n=V(()=>"dark"===e()?hl(t):pl(t)),{colors:r}=Vi,i=(t,n)=>"dark"===e()?n:t,s=gl(e=>{const t=e().getAll().find(e=>e.mutationId===Ha());return!!t&&t.state.isPaused}),a=gl(e=>{const t=e().getAll().find(e=>e.mutationId===Ha());return t?t.state.status:"idle"}),l=V(()=>o({isPaused:s(),status:a()})),d=gl(e=>e().getAll().find(e=>e.mutationId===Ha()),!1);return O(G,{get when(){return d()},get children(){var e=Ba(),o=e.firstChild,s=o.nextSibling,c=s.firstChild,u=c.firstChild,g=u.firstChild,p=u.nextSibling,h=c.nextSibling.firstChild.nextSibling,y=s.nextSibling,m=y.nextSibling,b=m.nextSibling,x=b.nextSibling,w=x.nextSibling,k=w.nextSibling,$=k.nextSibling,S=$.nextSibling;return f(g,O(G,{get when(){return d().options.mutationKey},fallback:"No mutationKey found",get children(){return v(d().options.mutationKey,!0)}})),f(p,O(G,{get when(){return"purple"===l()},children:"pending"}),null),f(p,O(G,{get when(){return"purple"!==l()},get children(){return a()}}),null),f(h,()=>new Date(d().state.submittedAt).toLocaleTimeString()),f(m,O(ra,{label:"Variables",defaultExpanded:["Variables"],get value(){return d().state.variables}})),f(x,O(ra,{label:"Context",defaultExpanded:["Context"],get value(){return d().state.context}})),f(k,O(ra,{label:"Data",defaultExpanded:["Data"],get value(){return d().state.data}})),f(S,O(ra,{label:"Mutation",defaultExpanded:["Mutation"],get value(){return d()}})),W(a=>{var d=Ge(n().detailsContainer,"tsqd-query-details-container"),c=Ge(n().detailsHeader,"tsqd-query-details-header"),u=Ge(n().detailsBody,"tsqd-query-details-summary-container"),g=Ge(n().queryDetailsStatus,"gray"===l()?t`
        background-color: ${i(r[l()][200],r[l()][700])};
        color: ${i(r[l()][700],r[l()][300])};
        border-color: ${i(r[l()][400],r[l()][600])};
      `:t`
      background-color: ${i(r[l()][100],r[l()][900])};
      color: ${i(r[l()][700],r[l()][300])};
      border-color: ${i(r[l()][400],r[l()][600])};
    `),f=Ge(n().detailsHeader,"tsqd-query-details-header"),h=Vi.size[2],v=Ge(n().detailsHeader,"tsqd-query-details-header"),C=Vi.size[2],E=Ge(n().detailsHeader,"tsqd-query-details-header"),M=Vi.size[2],F=Ge(n().detailsHeader,"tsqd-query-details-header"),L=Vi.size[2];return d!==a.e&&q(e,a.e=d),c!==a.t&&q(o,a.t=c),u!==a.a&&q(s,a.a=u),g!==a.o&&q(p,a.o=g),f!==a.i&&q(y,a.i=f),h!==a.n&&(null!=(a.n=h)?m.style.setProperty("padding",h):m.style.removeProperty("padding")),v!==a.s&&q(b,a.s=v),C!==a.h&&(null!=(a.h=C)?x.style.setProperty("padding",C):x.style.removeProperty("padding")),E!==a.r&&q(w,a.r=E),M!==a.d&&(null!=(a.d=M)?k.style.setProperty("padding",M):k.style.removeProperty("padding")),F!==a.l&&q($,a.l=F),L!==a.u&&(null!=(a.u=L)?S.style.setProperty("padding",L):S.style.removeProperty("padding")),a},{e:void 0,t:void 0,a:void 0,o:void 0,i:void 0,n:void 0,s:void 0,h:void 0,r:void 0,d:void 0,l:void 0,u:void 0}),e}})},al=new Map,ll=()=>{const e=V(()=>de().client.getQueryCache()),t=e().subscribe(t=>{H(()=>{for(const[n,r]of al.entries())r.shouldUpdate(t)&&r.setter(n(e))})});return h(()=>{al.clear(),t()}),t},dl=(e,t=!0,n=()=>!0)=>{const r=V(()=>de().client.getQueryCache()),[o,i]=N(e(r),t?void 0:{equals:!1});return $(()=>{i(e(r))}),al.set(e,{setter:i,shouldUpdate:n}),h(()=>{al.delete(e)}),o},cl=new Map,ul=()=>{const e=V(()=>de().client.getMutationCache()),t=e().subscribe(()=>{for(const[t,n]of cl.entries())queueMicrotask(()=>{n(t(e))})});return h(()=>{cl.clear(),t()}),t},gl=(e,t=!0)=>{const n=V(()=>de().client.getMutationCache()),[r,o]=N(e(n),t?void 0:{equals:!1});return $(()=>{o(e(n))}),cl.set(e,o),h(()=>{cl.delete(e)}),r},fl=(e,t)=>{const{colors:n,font:r,size:o,alpha:i,shadow:s,border:a}=Vi,l=(t,n)=>"light"===e?t:n;return{devtoolsBtn:t`
      z-index: 100000;
      position: fixed;
      padding: 4px;
      text-align: left;

      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9999px;
      box-shadow: ${s.md()};
      overflow: hidden;

      & div {
        position: absolute;
        top: -8px;
        left: -8px;
        right: -8px;
        bottom: -8px;
        border-radius: 9999px;

        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
        filter: blur(6px) saturate(1.2) contrast(1.1);
      }

      &:focus-within {
        outline-offset: 2px;
        outline: 3px solid ${n.green[600]};
      }

      & button {
        position: relative;
        z-index: 1;
        padding: 0;
        border-radius: 9999px;
        background-color: transparent;
        border: none;
        height: 40px;
        display: flex;
        width: 40px;
        overflow: hidden;
        cursor: pointer;
        outline: none;
        & svg {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      }
    `,panel:t`
      position: fixed;
      z-index: 9999;
      display: flex;
      gap: ${Vi.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${l(n.gray[300],n.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${l(n.gray[400],n.darkGray[300])};
      }
    `,parentPanel:t`
      z-index: 9999;
      display: flex;
      height: 100%;
      gap: ${Vi.size[.5]};
      & * {
        box-sizing: border-box;
        text-transform: none;
      }

      & *::-webkit-scrollbar {
        width: 7px;
      }

      & *::-webkit-scrollbar-track {
        background: transparent;
      }

      & *::-webkit-scrollbar-thumb {
        background: ${l(n.gray[300],n.darkGray[200])};
      }

      & *::-webkit-scrollbar-thumb:hover {
        background: ${l(n.gray[400],n.darkGray[300])};
      }
    `,"devtoolsBtn-position-bottom-right":t`
      bottom: 12px;
      right: 12px;
    `,"devtoolsBtn-position-bottom-left":t`
      bottom: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-left":t`
      top: 12px;
      left: 12px;
    `,"devtoolsBtn-position-top-right":t`
      top: 12px;
      right: 12px;
    `,"devtoolsBtn-position-relative":t`
      position: relative;
    `,"panel-position-top":t`
      top: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${o[14]};
      border-bottom: ${l(n.gray[400],n.darkGray[300])} 1px solid;
    `,"panel-position-bottom":t`
      bottom: 0;
      right: 0;
      left: 0;
      max-height: 90%;
      min-height: ${o[14]};
      border-top: ${l(n.gray[400],n.darkGray[300])} 1px solid;
    `,"panel-position-right":t`
      bottom: 0;
      right: 0;
      top: 0;
      border-left: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      max-width: 90%;
    `,"panel-position-left":t`
      bottom: 0;
      left: 0;
      top: 0;
      border-right: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      max-width: 90%;
    `,closeBtn:t`
      position: absolute;
      cursor: pointer;
      z-index: 5;
      display: flex;
      align-items: center;
      justify-content: center;
      outline: none;
      background-color: ${l(n.gray[50],n.darkGray[700])};
      &:hover {
        background-color: ${l(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline: 2px solid ${n.blue[600]};
      }
      & svg {
        color: ${l(n.gray[600],n.gray[400])};
        width: ${o[2]};
        height: ${o[2]};
      }
    `,"closeBtn-position-top":t`
      bottom: 0;
      right: ${o[2]};
      transform: translate(0, 100%);
      border-right: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-left: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: none;
      border-bottom: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: 0px 0px ${a.radius.sm} ${a.radius.sm};
      padding: ${o[.5]} ${o[1.5]} ${o[1]} ${o[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        bottom: 100%;
        left: -${o[2.5]};
        height: ${o[1.5]};
        width: calc(100% + ${o[5]});
      }

      & svg {
        transform: rotate(180deg);
      }
    `,"closeBtn-position-bottom":t`
      top: 0;
      right: ${o[2]};
      transform: translate(0, -100%);
      border-right: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-left: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: none;
      border-radius: ${a.radius.sm} ${a.radius.sm} 0px 0px;
      padding: ${o[1]} ${o[1.5]} ${o[.5]} ${o[1.5]};

      &::after {
        content: ' ';
        position: absolute;
        top: 100%;
        left: -${o[2.5]};
        height: ${o[1.5]};
        width: calc(100% + ${o[5]});
      }
    `,"closeBtn-position-right":t`
      bottom: ${o[2]};
      left: 0;
      transform: translate(-100%, 0);
      border-right: none;
      border-left: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: ${a.radius.sm} 0px 0px ${a.radius.sm};
      padding: ${o[1.5]} ${o[.5]} ${o[1.5]} ${o[1]};

      &::after {
        content: ' ';
        position: absolute;
        left: 100%;
        height: calc(100% + ${o[5]});
        width: ${o[1.5]};
      }

      & svg {
        transform: rotate(-90deg);
      }
    `,"closeBtn-position-left":t`
      bottom: ${o[2]};
      right: 0;
      transform: translate(100%, 0);
      border-left: none;
      border-right: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-top: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-bottom: ${l(n.gray[400],n.darkGray[300])} 1px solid;
      border-radius: 0px ${a.radius.sm} ${a.radius.sm} 0px;
      padding: ${o[1.5]} ${o[1]} ${o[1.5]} ${o[.5]};

      &::after {
        content: ' ';
        position: absolute;
        right: 100%;
        height: calc(100% + ${o[5]});
        width: ${o[1.5]};
      }

      & svg {
        transform: rotate(90deg);
      }
    `,queriesContainer:t`
      flex: 1 1 700px;
      background-color: ${l(n.gray[50],n.darkGray[700])};
      display: flex;
      flex-direction: column;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
    `,dragHandle:t`
      position: absolute;
      transition: background-color 0.125s ease;
      &:hover {
        background-color: ${n.purple[400]}${l("",i[90])};
      }
      z-index: 4;
    `,"dragHandle-position-top":t`
      bottom: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-bottom":t`
      top: 0;
      width: 100%;
      height: 3px;
      cursor: ns-resize;
    `,"dragHandle-position-right":t`
      left: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,"dragHandle-position-left":t`
      right: 0;
      width: 3px;
      height: 100%;
      cursor: ew-resize;
    `,row:t`
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: ${Vi.size[2]} ${Vi.size[2.5]};
      gap: ${Vi.size[2.5]};
      border-bottom: ${l(n.gray[300],n.darkGray[500])} 1px solid;
      align-items: center;
      & > button {
        padding: 0;
        background: transparent;
        border: none;
        display: flex;
        gap: ${o[.5]};
        flex-direction: column;
      }
    `,logoAndToggleContainer:t`
      display: flex;
      gap: ${Vi.size[3]};
      align-items: center;
    `,logo:t`
      cursor: pointer;
      display: flex;
      flex-direction: column;
      background-color: transparent;
      border: none;
      gap: ${Vi.size[.5]};
      padding: 0px;
      &:hover {
        opacity: 0.7;
      }
      &:focus-visible {
        outline-offset: 4px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,tanstackLogo:t`
      font-size: ${r.size.md};
      font-weight: ${r.weight.bold};
      line-height: ${r.lineHeight.xs};
      white-space: nowrap;
      color: ${l(n.gray[600],n.gray[300])};
    `,queryFlavorLogo:t`
      font-weight: ${r.weight.semibold};
      font-size: ${r.size.xs};
      background: linear-gradient(
        to right,
        ${l("#ea4037, #ff9b11","#dd524b, #e9a03b")}
      );
      background-clip: text;
      -webkit-background-clip: text;
      line-height: 1;
      -webkit-text-fill-color: transparent;
      white-space: nowrap;
    `,queryStatusContainer:t`
      display: flex;
      gap: ${Vi.size[2]};
      height: min-content;
    `,queryStatusTag:t`
      display: flex;
      gap: ${Vi.size[1.5]};
      box-sizing: border-box;
      height: ${Vi.size[6.5]};
      background: ${l(n.gray[50],n.darkGray[500])};
      color: ${l(n.gray[700],n.gray[300])};
      border-radius: ${Vi.border.radius.sm};
      font-size: ${r.size.sm};
      padding: ${Vi.size[1]};
      padding-left: ${Vi.size[1.5]};
      align-items: center;
      font-weight: ${r.weight.medium};
      border: ${l("1px solid "+n.gray[300],"1px solid transparent")};
      user-select: none;
      position: relative;
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
    `,queryStatusTagLabel:t`
      font-size: ${r.size.xs};
    `,queryStatusCount:t`
      font-size: ${r.size.xs};
      padding: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${l(n.gray[500],n.gray[400])};
      background-color: ${l(n.gray[200],n.darkGray[300])};
      border-radius: 2px;
      font-variant-numeric: tabular-nums;
      height: ${Vi.size[4.5]};
    `,statusTooltip:t`
      position: absolute;
      z-index: 1;
      background-color: ${l(n.gray[50],n.darkGray[500])};
      top: 100%;
      left: 50%;
      transform: translate(-50%, calc(${Vi.size[2]}));
      padding: ${Vi.size[.5]} ${Vi.size[2]};
      border-radius: ${Vi.border.radius.sm};
      font-size: ${r.size.xs};
      border: 1px solid ${l(n.gray[400],n.gray[600])};
      color: ${l(n.gray[600],n.gray[300])};

      &::before {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, -100%);
        position: absolute;
        border-color: transparent transparent
          ${l(n.gray[400],n.gray[600])} transparent;
        border-style: solid;
        border-width: 7px;
        /* transform: rotate(180deg); */
      }

      &::after {
        top: 0px;
        content: ' ';
        display: block;
        left: 50%;
        transform: translate(-50%, calc(-100% + 2px));
        position: absolute;
        border-color: transparent transparent
          ${l(n.gray[100],n.darkGray[500])} transparent;
        border-style: solid;
        border-width: 7px;
      }
    `,filtersContainer:t`
      display: flex;
      gap: ${Vi.size[2]};
      & > button {
        cursor: pointer;
        padding: ${Vi.size[.5]} ${Vi.size[1.5]} ${Vi.size[.5]}
          ${Vi.size[2]};
        border-radius: ${Vi.border.radius.sm};
        background-color: ${l(n.gray[100],n.darkGray[400])};
        border: 1px solid ${l(n.gray[300],n.darkGray[200])};
        color: ${l(n.gray[700],n.gray[300])};
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        line-height: ${r.lineHeight.sm};
        gap: ${Vi.size[1.5]};
        max-width: 160px;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${a.radius.xs};
          outline: 2px solid ${n.blue[800]};
        }
        & svg {
          width: ${Vi.size[3]};
          height: ${Vi.size[3]};
          color: ${l(n.gray[500],n.gray[400])};
        }
      }
    `,filterInput:t`
      padding: ${o[.5]} ${o[2]};
      border-radius: ${Vi.border.radius.sm};
      background-color: ${l(n.gray[100],n.darkGray[400])};
      display: flex;
      box-sizing: content-box;
      align-items: center;
      gap: ${Vi.size[1.5]};
      max-width: 160px;
      min-width: 100px;
      border: 1px solid ${l(n.gray[300],n.darkGray[200])};
      height: min-content;
      color: ${l(n.gray[600],n.gray[400])};
      & > svg {
        width: ${o[3]};
        height: ${o[3]};
      }
      & input {
        font-size: ${r.size.xs};
        width: 100%;
        background-color: ${l(n.gray[100],n.darkGray[400])};
        border: none;
        padding: 0;
        line-height: ${r.lineHeight.sm};
        color: ${l(n.gray[700],n.gray[300])};
        &::placeholder {
          color: ${l(n.gray[700],n.gray[300])};
        }
        &:focus {
          outline: none;
        }
      }

      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,filterSelect:t`
      padding: ${Vi.size[.5]} ${Vi.size[2]};
      border-radius: ${Vi.border.radius.sm};
      background-color: ${l(n.gray[100],n.darkGray[400])};
      display: flex;
      align-items: center;
      gap: ${Vi.size[1.5]};
      box-sizing: content-box;
      max-width: 160px;
      border: 1px solid ${l(n.gray[300],n.darkGray[200])};
      height: min-content;
      & > svg {
        color: ${l(n.gray[600],n.gray[400])};
        width: ${Vi.size[2]};
        height: ${Vi.size[2]};
      }
      & > select {
        appearance: none;
        color: ${l(n.gray[700],n.gray[300])};
        min-width: 100px;
        line-height: ${r.lineHeight.sm};
        font-size: ${r.size.xs};
        background-color: ${l(n.gray[100],n.darkGray[400])};
        border: none;
        &:focus {
          outline: none;
        }
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,actionsContainer:t`
      display: flex;
      gap: ${Vi.size[2]};
    `,actionsBtn:t`
      border-radius: ${Vi.border.radius.sm};
      background-color: ${l(n.gray[100],n.darkGray[400])};
      border: 1px solid ${l(n.gray[300],n.darkGray[200])};
      width: ${Vi.size[6.5]};
      height: ${Vi.size[6.5]};
      justify-content: center;
      display: flex;
      align-items: center;
      gap: ${Vi.size[1.5]};
      max-width: 160px;
      cursor: pointer;
      padding: 0;
      &:hover {
        background-color: ${l(n.gray[200],n.darkGray[500])};
      }
      & svg {
        color: ${l(n.gray[700],n.gray[300])};
        width: ${Vi.size[3]};
        height: ${Vi.size[3]};
      }
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
    `,actionsBtnOffline:t`
      & svg {
        stroke: ${l(n.yellow[700],n.yellow[500])};
        fill: ${l(n.yellow[700],n.yellow[500])};
      }
    `,overflowQueryContainer:t`
      flex: 1;
      overflow-y: auto;
      & > div {
        display: flex;
        flex-direction: column;
      }
    `,queryRow:t`
      display: flex;
      align-items: center;
      padding: 0;
      border: none;
      cursor: pointer;
      color: ${l(n.gray[700],n.gray[300])};
      background-color: ${l(n.gray[50],n.darkGray[700])};
      line-height: 1;
      &:focus {
        outline: none;
      }
      &:focus-visible {
        outline-offset: -2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      &:hover .tsqd-query-hash {
        background-color: ${l(n.gray[200],n.darkGray[600])};
      }

      & .tsqd-query-observer-count {
        padding: 0 ${Vi.size[1]};
        user-select: none;
        min-width: ${Vi.size[6.5]};
        align-self: stretch;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${r.size.xs};
        font-weight: ${r.weight.medium};
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom: 1px solid ${l(n.gray[300],n.darkGray[700])};
      }
      & .tsqd-query-hash {
        user-select: text;
        font-size: ${r.size.xs};
        display: flex;
        align-items: center;
        min-height: ${Vi.size[6]};
        flex: 1;
        padding: ${Vi.size[1]} ${Vi.size[2]};
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        border-bottom: 1px solid ${l(n.gray[300],n.darkGray[400])};
        text-align: left;
        text-overflow: clip;
        word-break: break-word;
      }

      & .tsqd-query-disabled-indicator {
        align-self: stretch;
        display: flex;
        align-items: center;
        padding: 0 ${Vi.size[2]};
        color: ${l(n.gray[800],n.gray[300])};
        background-color: ${l(n.gray[300],n.darkGray[600])};
        border-bottom: 1px solid ${l(n.gray[300],n.darkGray[400])};
        font-size: ${r.size.xs};
      }
    `,selectedQueryRow:t`
      background-color: ${l(n.gray[200],n.darkGray[500])};
    `,detailsContainer:t`
      flex: 1 1 700px;
      background-color: ${l(n.gray[50],n.darkGray[700])};
      color: ${l(n.gray[700],n.gray[300])};
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      display: flex;
      text-align: left;
    `,detailsHeader:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: ${l(n.gray[200],n.darkGray[600])};
      padding: ${Vi.size[1.5]} ${Vi.size[2]};
      font-weight: ${r.weight.medium};
      font-size: ${r.size.xs};
      line-height: ${r.lineHeight.xs};
      text-align: left;
    `,detailsBody:t`
      margin: ${Vi.size[1.5]} 0px ${Vi.size[2]} 0px;
      & > div {
        display: flex;
        align-items: stretch;
        padding: 0 ${Vi.size[2]};
        line-height: ${r.lineHeight.sm};
        justify-content: space-between;
        & > span {
          font-size: ${r.size.xs};
        }
        & > span:nth-child(2) {
          font-variant-numeric: tabular-nums;
        }
      }

      & > div:first-child {
        margin-bottom: ${Vi.size[1.5]};
      }

      & code {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
          'Liberation Mono', 'Courier New', monospace;
        margin: 0;
        font-size: ${r.size.xs};
        line-height: ${r.lineHeight.xs};
      }

      & pre {
        margin: 0;
        display: flex;
        align-items: center;
      }
    `,queryDetailsStatus:t`
      border: 1px solid ${n.darkGray[200]};
      border-radius: ${Vi.border.radius.sm};
      font-weight: ${r.weight.medium};
      padding: ${Vi.size[1]} ${Vi.size[2.5]};
    `,actionsBody:t`
      flex-wrap: wrap;
      margin: ${Vi.size[2]} 0px ${Vi.size[2]} 0px;
      display: flex;
      gap: ${Vi.size[2]};
      padding: 0px ${Vi.size[2]};
      & > button {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
        font-size: ${r.size.xs};
        padding: ${Vi.size[1]} ${Vi.size[2]};
        display: flex;
        border-radius: ${Vi.border.radius.sm};
        background-color: ${l(n.gray[100],n.darkGray[600])};
        border: 1px solid ${l(n.gray[300],n.darkGray[400])};
        align-items: center;
        gap: ${Vi.size[2]};
        font-weight: ${r.weight.medium};
        line-height: ${r.lineHeight.xs};
        cursor: pointer;
        &:focus-visible {
          outline-offset: 2px;
          border-radius: ${a.radius.xs};
          outline: 2px solid ${n.blue[800]};
        }
        &:hover {
          background-color: ${l(n.gray[200],n.darkGray[500])};
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        & > span {
          width: ${o[1.5]};
          height: ${o[1.5]};
          border-radius: ${Vi.border.radius.full};
        }
      }
    `,actionsSelect:t`
      font-size: ${r.size.xs};
      padding: ${Vi.size[.5]} ${Vi.size[2]};
      display: flex;
      border-radius: ${Vi.border.radius.sm};
      overflow: hidden;
      background-color: ${l(n.gray[100],n.darkGray[600])};
      border: 1px solid ${l(n.gray[300],n.darkGray[400])};
      align-items: center;
      gap: ${Vi.size[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.sm};
      color: ${l(n.red[500],n.red[400])};
      cursor: pointer;
      position: relative;
      &:hover {
        background-color: ${l(n.gray[200],n.darkGray[500])};
      }
      & > span {
        width: ${o[1.5]};
        height: ${o[1.5]};
        border-radius: ${Vi.border.radius.full};
      }
      &:focus-within {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      & select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        appearance: none;
        background-color: transparent;
        border: none;
        color: transparent;
        outline: none;
      }

      & svg path {
        stroke: ${Vi.colors.red[400]};
      }
      & svg {
        width: ${Vi.size[2]};
        height: ${Vi.size[2]};
      }
    `,settingsMenu:t`
      display: flex;
      & * {
        font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      }
      flex-direction: column;
      gap: ${o[.5]};
      border-radius: ${Vi.border.radius.sm};
      border: 1px solid ${l(n.gray[300],n.gray[700])};
      background-color: ${l(n.gray[50],n.darkGray[600])};
      font-size: ${r.size.xs};
      color: ${l(n.gray[700],n.gray[300])};
      z-index: 99999;
      min-width: 120px;
      padding: ${o[.5]};
    `,settingsSubTrigger:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: ${Vi.border.radius.xs};
      padding: ${Vi.size[1]} ${Vi.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      color: ${l(n.gray[700],n.gray[300])};
      & svg {
        color: ${l(n.gray[600],n.gray[400])};
        transform: rotate(-90deg);
        width: ${Vi.size[2]};
        height: ${Vi.size[2]};
      }
      &:hover {
        background-color: ${l(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
      &.data-disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,settingsMenuHeader:t`
      padding: ${Vi.size[1]} ${Vi.size[1]};
      font-weight: ${r.weight.medium};
      border-bottom: 1px solid ${l(n.gray[300],n.darkGray[400])};
      color: ${l(n.gray[500],n.gray[400])};
      font-size: ${r.size.xs};
    `,settingsSubButton:t`
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: ${l(n.gray[700],n.gray[300])};
      font-size: ${r.size.xs};
      border-radius: ${Vi.border.radius.xs};
      padding: ${Vi.size[1]} ${Vi.size[1]};
      cursor: pointer;
      background-color: transparent;
      border: none;
      & svg {
        color: ${l(n.gray[600],n.gray[400])};
      }
      &:hover {
        background-color: ${l(n.gray[200],n.darkGray[500])};
      }
      &:focus-visible {
        outline-offset: 2px;
        outline: 2px solid ${n.blue[800]};
      }
    `,themeSelectedButton:t`
      background-color: ${l(n.purple[100],n.purple[900])};
      color: ${l(n.purple[700],n.purple[300])};
      & svg {
        color: ${l(n.purple[700],n.purple[300])};
      }
      &:hover {
        background-color: ${l(n.purple[100],n.purple[900])};
      }
    `,viewToggle:t`
      border-radius: ${Vi.border.radius.sm};
      background-color: ${l(n.gray[200],n.darkGray[600])};
      border: 1px solid ${l(n.gray[300],n.darkGray[200])};
      display: flex;
      padding: 0;
      font-size: ${r.size.xs};
      color: ${l(n.gray[700],n.gray[300])};
      overflow: hidden;

      &:has(:focus-visible) {
        outline: 2px solid ${n.blue[800]};
      }

      & .tsqd-radio-toggle {
        opacity: 0.5;
        display: flex;
        & label {
          display: flex;
          align-items: center;
          cursor: pointer;
          line-height: ${r.lineHeight.md};
        }

        & label:hover {
          background-color: ${l(n.gray[100],n.darkGray[500])};
        }
      }

      & > [data-checked] {
        opacity: 1;
        background-color: ${l(n.gray[100],n.darkGray[400])};
        & label:hover {
          background-color: ${l(n.gray[100],n.darkGray[400])};
        }
      }

      & .tsqd-radio-toggle:first-child {
        & label {
          padding: 0 ${Vi.size[1.5]} 0 ${Vi.size[2]};
        }
        border-right: 1px solid ${l(n.gray[300],n.darkGray[200])};
      }

      & .tsqd-radio-toggle:nth-child(2) {
        & label {
          padding: 0 ${Vi.size[2]} 0 ${Vi.size[1.5]};
        }
      }
    `,devtoolsEditForm:t`
      padding: ${o[2]};
      & > [data-error='true'] {
        outline: 2px solid ${l(n.red[200],n.red[800])};
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
      }
    `,devtoolsEditTextarea:t`
      width: 100%;
      max-height: 500px;
      font-family: 'Fira Code', monospace;
      font-size: ${r.size.xs};
      border-radius: ${a.radius.sm};
      field-sizing: content;
      padding: ${o[2]};
      background-color: ${l(n.gray[100],n.darkGray[800])};
      color: ${l(n.gray[900],n.gray[100])};
      border: 1px solid ${l(n.gray[200],n.gray[700])};
      resize: none;
      &:focus {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${l(n.blue[200],n.blue[800])};
      }
    `,devtoolsEditFormActions:t`
      display: flex;
      justify-content: space-between;
      gap: ${o[2]};
      align-items: center;
      padding-top: ${o[1]};
      font-size: ${r.size.xs};
    `,devtoolsEditFormError:t`
      color: ${l(n.red[700],n.red[500])};
    `,devtoolsEditFormActionContainer:t`
      display: flex;
      gap: ${o[2]};
    `,devtoolsEditFormAction:t`
      font-family: ui-sans-serif, Inter, system-ui, sans-serif, sans-serif;
      font-size: ${r.size.xs};
      padding: ${o[1]} ${Vi.size[2]};
      display: flex;
      border-radius: ${a.radius.sm};
      background-color: ${l(n.gray[100],n.darkGray[600])};
      border: 1px solid ${l(n.gray[300],n.darkGray[400])};
      align-items: center;
      gap: ${o[2]};
      font-weight: ${r.weight.medium};
      line-height: ${r.lineHeight.xs};
      cursor: pointer;
      &:focus-visible {
        outline-offset: 2px;
        border-radius: ${a.radius.xs};
        outline: 2px solid ${n.blue[800]};
      }
      &:hover {
        background-color: ${l(n.gray[200],n.darkGray[500])};
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `}},pl=e=>fl("light",e),hl=e=>fl("dark",e);n(["click","mousedown","input"]);export{le as a,ee as c,ue as i,_a as n,ie as o,Za as r,fe as s,Ja as t};