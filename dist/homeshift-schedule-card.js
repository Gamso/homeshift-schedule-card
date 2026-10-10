function t(t,e,s,i){var n,r=arguments.length,o=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(o=(r<3?n(o):r>3?n(e,s,o):n(e,s))||o);return r>3&&o&&Object.defineProperty(e,s,o),o}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}};const o=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,p=globalThis,f=p.trustedTypes,m=f?f.emptyScript:"",_=p.reactiveElementPolyfillSupport,g=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:b};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);n?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:$).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=i;const r=n.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const r=this.constructor;if(!1===i&&(n=this[t]),s??=r.getPropertyOptions(t),!((s.hasChanged??b)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[g("elementProperties")]=new Map,v[g("finalized")]=new Map,_?.({ReactiveElement:v}),(p.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const A=globalThis,w=t=>t,x=A.trustedTypes,E=x?x.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,P=`<${C}>`,M=document,O=()=>M.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,R=Array.isArray,T="[ \t\n\f\r]",H=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,D=/>/g,j=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,B=/"/g,L=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,F=M.createTreeWalker(M,129);function K(t,e){if(!R(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=H;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(o.lastIndex=h,l=o.exec(s),null!==l);)h=o.lastIndex,o===H?"!--"===l[1]?o=N:void 0!==l[1]?o=D:void 0!==l[2]?(L.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=j):void 0!==l[3]&&(o=j):o===j?">"===l[0]?(o=n??H,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?j:'"'===l[3]?B:z):o===B||o===z?o=j:o===N||o===D?o=H:(o=j,n=void 0);const d=o===j&&t[e+1].startsWith("/>")?" ":"";r+=o===H?s+P:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+k+d):s+k+(-2===c?e:d)}return[K(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=X.createElement(l,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[r++],s=i.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:s,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(L.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=x?x.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),F.nextNode(),a.push({type:2,index:++n});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===V)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const r=U(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=Z(t,n._$AS(t,e.values),n,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);F.currentNode=i;let n=F.nextNode(),r=0,o=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Q(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new it(n,this,t)),this._$AV.push(e),a=s[++o]}r!==a?.index&&(n=F.nextNode(),r++)}return F.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),U(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>R(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new X(t)),e}k(t){R(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Q(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const n=this.strings;let r=!1;if(void 0===n)t=Z(this,t,e,0),r=!U(t)||t!==this._$AH&&t!==V,r&&(this._$AH=t);else{const i=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=Z(this,i[s+o],e,o),a===V&&(a=this._$AH[o]),r||=!U(a)||a!==this._$AH[o],a===W?t=W:t!==W&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends Y{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===V)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const nt=A.litHtmlPolyfillSupport;nt?.(X,Q),(A.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new Q(e.insertBefore(O(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:b},ct=(t=lt,e,s)=>{const{kind:i,metadata:n}=s;let r=globalThis.litPropertyMetadata.get(n);if(void 0===r&&globalThis.litPropertyMetadata.set(n,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t){return ht({...t,state:!0,attribute:!1})}const ut={en:{tabs:{active_mode:"Active mode"},timeline:{edit:"Edit schedules",back:"Back to timeline",empty:"No schedule for this mode",on:"On",off:"Off"},scheduler:{next_run:"Next run",days:"Schedule"},errors:{no_modes:"No mode to show: {entity} has no options.",schedules_unavailable:"Could not read the schedules: is the Scheduler integration installed?"}},fr:{tabs:{active_mode:"Mode actif"},timeline:{edit:"Modifier les planifications",back:"Retour à la frise",empty:"Aucune planification pour ce mode",on:"Allumé",off:"Éteint"},scheduler:{next_run:"Prochain lancement",days:"Planification"},errors:{no_modes:"Aucun mode à afficher : {entity} n'a pas d'options.",schedules_unavailable:"Impossible de lire les planifications : l'intégration Scheduler est-elle installée ?"}}};function pt(t,e){return e.split(".").reduce((t,e)=>t&&null!=t[e]?t[e]:void 0,t)}function ft(t,e,s,i){const n=function(t){const e=t?.locale?.language||t?.language||"en",s=String(e).split("-")[0];return ut[e]?e:ut[s]?s:"en"}(t);let r=pt(ut[n],e)??pt(ut.en,e)??i;return null==r?e:(s&&Object.entries(s).forEach(([t,e])=>r=r.replace(`{${t}}`,e)),r)}function mt(t,e){const s=e?.states?.[t.mode_entity??""]?.state;return s&&"unavailable"!==s&&"unknown"!==s?s:void 0}const _t=1440;function gt(t){const[e,s]=t.split(":").map(Number);return 60*e+(s||0)}function $t(t){const e=t%_t;return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}const bt=t=>t.service.startsWith("climate.");function yt(t){return t.timeslots.some(t=>t.actions.some(bt))}function vt(t){const e=yt(t),s=t.timeslots.filter(t=>!e||t.actions.some(bt)).map(t=>({slot:t,start:gt(t.start)})).sort((t,e)=>t.start-e.start),i=[];return s.forEach(({slot:t,start:e},n)=>{const r=function(t){const e=t.actions?.find(bt)??t.actions?.[0];if(!e)return{kind:"other",label:""};const[,s]=e.service.split("."),i=e.service_data??{},n=e.entity_id,r=i.hvac_mode;if("off"===r)return{kind:"off",entity:n,hvacMode:r,label:r};if("turn_off"===s)return{kind:"off",entity:n,label:"off"};if("number"==typeof i.temperature)return{kind:"cool"===r?"cool":"heat",entity:n,temperature:i.temperature,label:`${i.temperature}°`};if(null!=i.preset_mode){const t=String(i.preset_mode);return{kind:"preset",entity:n,preset:t,label:t}}return r?{kind:"cool"===r?"cool":"heat",entity:n,hvacMode:r,label:r}:"turn_on"===s?{kind:"on",entity:n,label:"on"}:{kind:"other",entity:n,label:s??e.service}}(t);let o;if(null!=t.stop)o=gt(t.stop),o<=e&&(o+=_t);else{const t=s[(n+1)%s.length].start;o=t>e?t:t+_t}o>_t?(i.push({start:e,end:_t,value:r}),o-_t>0&&i.push({start:0,end:o-_t,value:r})):i.push({start:e,end:o,value:r})}),function(t){const e=[];for(const s of t){const t=e[e.length-1];t&&t.end===s.start&&At(t.value,s.value)?t.end=s.end:e.push({...s})}return e}(i.filter(t=>t.end>t.start).sort((t,e)=>t.start-e.start))}function At(t,e){return t.kind===e.kind&&t.temperature===e.temperature&&t.preset===e.preset&&t.hvacMode===e.hvacMode&&t.label===e.label}function wt(t,e=!1){const s=e&&yt(t),i=t.timeslots.flatMap(t=>t.actions.filter(t=>!s||bt(t)).map(t=>t.entity_id).filter(t=>!!t));return[...new Set(i)]}const xt={heat:"mdi:radiator",cool:"mdi:snowflake",preset:"mdi:radiator",on:"mdi:toggle-switch-outline",off:"mdi:toggle-switch-off-outline",other:"mdi:calendar-clock"};function Et(t){return"cool"===t?"cool":"heat"===t||"preset"===t?"heat":void 0}const St=["heat","preset","cool","on","off","other"];function kt(t){const e=new Set(t.map(t=>t.value.kind));return["cool","heat","preset","on","off"].find(t=>e.has(t))??"other"}class Ct extends ot{constructor(){super(...arguments),this._cardsVersion=0,this._cards=new Map,this._building=new Set,this._schedulesError=!1,this._editing=!1}connectedCallback(){super.connectedCallback(),this._clock=setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._clock)}static getStubConfig(){return{mode_entity:"select.homeshift_day_mode",entities:[]}}setConfig(t){!function(t){if(!t)throw new Error("Invalid configuration");if(!t.mode_entity&&!t.modes?.length)throw new Error("Set `mode_entity` (a select) or a list of `modes`.");if(null!=t.entities&&!Array.isArray(t.entities))throw new Error("`entities` must be a list of entity ids.");for(const e of t.modes??[])if("string"!=typeof e&&!e?.name)throw new Error("Each entry of `modes` needs a `name`.")}(t),this._config=t,this._cards=new Map,this._building.clear()}getCardSize(){return 6}getGridOptions(){return{columns:12,min_columns:6}}get _modes(){return function(t,e){const s=e?.states?.[t.mode_entity??""]?.attributes?.options??[];return(t.modes?.length?t.modes:s).map(e=>{const s="string"==typeof e?{name:e}:e,i=[...t.entities??[],...s.entities??[],...t.extra_entities?.[s.name]??[]];return{name:s.name,label:s.label??s.name,tag:s.tag??s.name,entities:[...new Set(i)]}})}(this._config,this.hass)}willUpdate(t){if(!t.has("hass")||!this.hass)return;const e=mt(this._config,this.hass),s=this._modes,i=!1!==this._config.follow_mode&&e!==this._lastActive;e&&s.some(t=>t.name===e)&&(i||!this._selected)?this._selected=e:s.some(t=>t.name===this._selected)||(this._selected=s[0]?.name),this._lastActive=e,this._timeline&&this._refreshSchedules()}get _timeline(){return"list"!==this._config.layout}_refreshSchedules(){const t=Object.values(this.hass.states).filter(t=>t.entity_id.startsWith("switch.schedule")).map(t=>`${t.entity_id}:${t.last_updated}`).join("|");t!==this._schedulesKey&&(this._schedulesKey=t,this.hass.callWS({type:"scheduler"}).then(t=>{this._schedules=t,this._schedulesError=!1}).catch(()=>{this._schedulesError=!0}))}updated(){const t=this._selected?this._cards.get(this._selected):void 0;t&&t.hass!==this.hass&&(t.hass=this.hass)}_card(t){const e=this._cards.get(t.name);if(e)return e;this._building.has(t.name)||(this._building.add(t.name),this._buildCard(t).finally(()=>this._building.delete(t.name)))}async _buildCard(t){const e=function(t,e,s){return{title:!1,discover_existing:!1,show_header_toggle:!1,time_step:5,sort_by:["title"],display_options:{primary_info:[`<i><b><font color="${t.name_color??"orange"}">{name}</font></b></i>`],secondary_info:[`<i><b>${ft(s,"scheduler.next_run")}</b></i> {relative-time}`,`<i><b>${ft(s,"scheduler.days")}</b></i> {days}`,"additional-tasks"],icon:"entity"},...t.scheduler,type:"custom:scheduler-card",tags:[e.tag],...e.entities.length?{include:e.entities}:{}}}(this._config,t,this.hass),s=this._cards;this._helpers??(this._helpers=window.loadCardHelpers?.()??Promise.resolve(void 0));const i=await this._helpers;let n;i?n=i.createCardElement(e):(await customElements.whenDefined("scheduler-card"),n=document.createElement("scheduler-card"),n.setConfig(e)),s===this._cards&&(n.addEventListener("ll-rebuild",e=>{e.stopPropagation(),this._cards.delete(t.name),this._cardsVersion++}),n.hass=this.hass,this._cards.set(t.name,n),this._cardsVersion++)}_select(t){this._selected=t,this._editing=!1}_onTabKeydown(t,e){const s={ArrowRight:1,ArrowLeft:-1}[t.key];if(!s)return;const i=e.findIndex(t=>t.name===this._selected),n=e[(i+s+e.length)%e.length];this._select(n.name),t.preventDefault(),this.updateComplete.then(()=>this.shadowRoot?.querySelector('[aria-selected="true"]')?.focus())}render(){if(!this._config||!this.hass)return W;const t=this._modes;if(!t.length)return I`<ha-alert alert-type="warning">
        ${ft(this.hass,"errors.no_modes",{entity:this._config.mode_entity??""})}
      </ha-alert>`;const e=mt(this._config,this.hass),s=t.find(t=>t.name===this._selected)??t[0],i=this._config.accent_color??"#44739E";return I`
      <div class="root" style="--hsc-accent: ${i}">
        <div
          class="tabs"
          role="tablist"
          @keydown=${e=>this._onTabKeydown(e,t)}
        >
          ${t.map(t=>{const i=t.name===s.name;return I`
              <button
                class="tab ${i?"selected":""}"
                role="tab"
                aria-selected=${i?"true":"false"}
                tabindex=${i?0:-1}
                @click=${()=>this._select(t.name)}
              >
                <span class="label">${t.label}</span>
                ${t.name===e?I`<span
                      class="active-dot"
                      title=${ft(this.hass,"tabs.active_mode")}
                      aria-label=${ft(this.hass,"tabs.active_mode")}
                    ></span>`:W}
              </button>
            `})}
        </div>
        <div class="content" role="tabpanel">${this._renderContent(s)}</div>
      </div>
    `}_renderContent(t){return this._timeline?this._editing?I`
        <button class="link" @click=${()=>this._editing=!1}>
          <ha-icon icon="mdi:chart-timeline"></ha-icon>${ft(this.hass,"timeline.back")}
        </button>
        ${this._card(t)??W}
      `:this._renderTimeline(t):this._card(t)??W}_renderTimeline(t){if(this._schedulesError)return I`<ha-alert alert-type="error">${ft(this.hass,"errors.schedules_unavailable")}</ha-alert>`;const e=new Date,s=60*e.getHours()+e.getMinutes(),i=function(t,e,s){return t.filter(t=>t.tags?.includes(e)).filter(t=>!s.length||wt(t).some(t=>s.includes(t))).sort((t,e)=>t.name.localeCompare(e.name))}(this._schedules??[],t.tag,t.entities);return I`
      <div class="timeline">
        ${this._schedules&&!i.length?I`<div class="empty">${ft(this.hass,"timeline.empty")}</div>`:I`
              ${this._rooms(i).map(t=>this._renderRoom(t,s))}
              <div class="axis" aria-hidden="true">
                ${[0,6,12,18,24].map(t=>I`<span style="left: ${t/24*100}%">${t}h</span>`)}
              </div>
            `}
        <div class="footer">
          <button class="link" @click=${()=>this._editing=!0}>
            <ha-icon icon="mdi:pencil"></ha-icon>${ft(this.hass,"timeline.edit")}
          </button>
        </div>
      </div>
    `}_rooms(t){const e=new Map;for(const s of t){const t=wt(s,!0),i=1===t.length?t[0]:void 0,n=i??s.entity_id;if(!e.has(n)){const t=i?this.hass.states[i]?.attributes?.friendly_name??i:s.name;e.set(n,{name:t,entity:i,schedules:[]})}e.get(n).schedules.push(s)}for(const t of e.values())t.schedules.sort((t,e)=>St.indexOf(kt(vt(t)))-St.indexOf(kt(vt(e))));return[...e.values()]}_renderRoom(t,e){const s=t.entity?.startsWith("climate.")?this.hass.states[t.entity]?.attributes?.current_temperature:void 0,i=t.schedules.every(t=>!this._enabled(t));return I`
      <div class="room">
        <div class="room-head">
          <span class="room-name ${i?"disabled":""}">${t.name}</span>
          ${"number"==typeof s?I`<span class="measured">${this._number(s)}°</span>`:W}
        </div>
        ${t.schedules.map(s=>this._renderRow(s,t,e))}
      </div>
    `}_enabled(t){const e=this.hass.states[t.entity_id];return e?"off"!==e.state:t.enabled}_renderRow(t,e,s){const i=vt(t),n=kt(i),r=this._enabled(t);return I`
      <div class="row ${r?"":"disabled"}" title=${t.name}>
        <ha-icon class="kind ${n}" icon=${xt[n]}></ha-icon>
        <div class="bar">
          ${i.map(t=>this._renderSegment(t))}
          <div class="now" style="left: ${s/_t*100}%"></div>
        </div>
        <button
          class="switch ${r?"on":""}"
          role="switch"
          aria-checked=${r?"true":"false"}
          aria-label=${t.name}
          @click=${()=>this._toggle(t,e,r)}
        ></button>
      </div>
    `}_renderSegment(t){const{background:e,color:s}=function(t){switch(t.kind){case"cool":return{background:"#378ADD",color:"#fff"};case"off":return{background:"var(--divider-color, #5F5E5A)",color:"var(--secondary-text-color)"};case"on":return{background:"#1D9E75",color:"#fff"};case"other":return{background:"#888780",color:"#fff"};case"preset":return function(t){const e=t.toLowerCase();return/frost|hors|away|absen|vacation/.test(e)?{background:"#85B7EB",color:"#042C53"}:/eco|sleep|night|nuit/.test(e)?{background:"#FAC775",color:"#412402"}:/boost/.test(e)?{background:"#A32D2D",color:"#fff"}:/comfort|confort|home|activity/.test(e)?{background:"#EF9F27",color:"#412402"}:{background:"#B4B2A9",color:"#2C2C2A"}}(t.preset??"")}const e=t.temperature??19;return e<15?{background:"#85B7EB",color:"#042C53"}:e<17.5?{background:"#FAC775",color:"#412402"}:e<19.5?{background:"#EF9F27",color:"#412402"}:e<21?{background:"#D85A30",color:"#fff"}:{background:"#A32D2D",color:"#fff"}}(t.value),i=(t.end-t.start)/_t*100,n=`${$t(t.start)} – ${$t(t.end)}`;return I`<div
      class="segment"
      style="left: ${t.start/_t*100}%; width: ${i}%; background-color: ${e}; color: ${s}"
      title="${n} · ${this._label(t.value)}"
    >
      ${i>=8?this._label(t.value):W}
    </div>`}_number(t){const e=this.hass.locale?.language??this.hass.language??"en";return t.toLocaleString(e,{maximumFractionDigits:1})}_label(t){const e=t.entity?this.hass.states[t.entity]:void 0;return null!=t.temperature?`${this._number(t.temperature)}°`:null!=t.preset?e&&this.hass.formatEntityAttributeValue?this.hass.formatEntityAttributeValue(e,"preset_mode",t.preset):t.preset:null!=t.hvacMode?e&&this.hass.formatEntityState?this.hass.formatEntityState(e,t.hvacMode):t.hvacMode:"on"===t.kind||"off"===t.kind?ft(this.hass,`timeline.${t.kind}`):t.label}async _toggle(t,e,s){if(s)return void await this.hass.callService("switch","turn_off",{entity_id:t.entity_id});const i=Et(kt(vt(t))),n=i?e.schedules.filter(e=>{const s=Et(kt(vt(e)));return e!==t&&s&&s!==i&&this._enabled(e)}):[];n.length&&await this.hass.callService("switch","turn_off",{entity_id:n.map(t=>t.entity_id)}),await this.hass.callService("switch","turn_on",{entity_id:t.entity_id})}}Ct.styles=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)})`
    .root {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      display: flex;
      border-bottom: 1px solid var(--divider-color);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tab {
      flex: 1 0 auto;
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 14px 16px;
      border: none;
      background: none;
      cursor: pointer;
      font: inherit;
      font-size: 16px;
      font-weight: 500;
      color: var(--secondary-text-color);
      border-radius: 4px 4px 0 0;
    }
    .tab:hover {
      background: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
    }
    .tab:focus-visible {
      outline: 2px solid var(--hsc-accent);
      outline-offset: -2px;
    }
    .tab.selected {
      color: var(--hsc-accent);
    }
    .tab.selected::after {
      content: "";
      position: absolute;
      left: 16px;
      right: 16px;
      bottom: 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--hsc-accent);
    }
    .active-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--state-active-color, var(--success-color, #43a047));
      flex: none;
    }
    .content {
      margin-top: 8px;
    }
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      background: var(--ha-card-background, var(--card-background-color));
    }
    .room {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .room-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .room-name {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
    .room-name.disabled {
      color: var(--secondary-text-color);
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .row .bar {
      flex: 1;
    }
    /* A disabled schedule keeps its colors, hatched, so inactive modes stay readable. */
    .row.disabled .segment {
      background-image: repeating-linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.3) 0 4px,
        transparent 4px 8px
      );
    }
    .kind {
      flex: none;
      --mdc-icon-size: 18px;
      color: var(--secondary-text-color);
    }
    .kind.heat,
    .kind.preset {
      color: #ef9f27;
    }
    .kind.cool {
      color: #378add;
    }
    .measured {
      flex: none;
      padding: 1px 8px;
      border-radius: 10px;
      background: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
      font-size: 12px;
    }
    .switch {
      position: relative;
      flex: none;
      width: 34px;
      height: 18px;
      border: none;
      border-radius: 9px;
      background: var(--disabled-color, #888);
      cursor: pointer;
      padding: 0;
    }
    .switch::after {
      content: "";
      position: absolute;
      top: 3px;
      left: 3px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      transition: left 0.15s;
    }
    .switch.on {
      background: var(--switch-checked-track-color, var(--primary-color));
    }
    .switch.on::after {
      left: 19px;
    }
    .bar {
      position: relative;
      height: 22px;
      border-radius: 6px;
      background: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
      overflow: hidden;
    }
    .segment {
      position: absolute;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      box-shadow: inset -1px 0 0 var(--ha-card-background, var(--card-background-color));
    }
    .now {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 2px;
      margin-left: -1px;
      background: var(--primary-text-color);
    }
    .axis {
      position: relative;
      height: 14px;
      /* Under the bars only: past the kind icon (18 + 8 px) and before the switch (34 + 8 px). */
      margin: -6px 42px 0 26px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .axis span {
      position: absolute;
      transform: translateX(-50%);
    }
    .axis span:first-child {
      transform: none;
    }
    .axis span:last-child {
      transform: translateX(-100%);
    }
    .empty {
      padding: 16px 0;
      text-align: center;
      color: var(--secondary-text-color);
    }
    .footer {
      display: flex;
      border-top: 1px solid var(--divider-color);
      padding-top: 8px;
    }
    .link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border: none;
      background: none;
      padding: 4px 0;
      color: var(--primary-color);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      --mdc-icon-size: 18px;
    }
  `,t([ht({attribute:!1})],Ct.prototype,"hass",void 0),t([dt()],Ct.prototype,"_config",void 0),t([dt()],Ct.prototype,"_selected",void 0),t([dt()],Ct.prototype,"_cardsVersion",void 0),t([dt()],Ct.prototype,"_schedules",void 0),t([dt()],Ct.prototype,"_schedulesError",void 0),t([dt()],Ct.prototype,"_editing",void 0),customElements.define("homeshift-schedule-card",Ct),window.customCards=window.customCards||[],window.customCards.push({type:"homeshift-schedule-card",name:"HomeShift Schedule Card",description:"Scheduler schedules per day mode, as 24 h timelines in tabs following a select.",preview:!1});
