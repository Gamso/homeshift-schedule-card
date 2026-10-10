function t(t,e,s,i){var r,o=arguments.length,n=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(r=t[a])&&(n=(o<3?r(n):o>3?r(e,s,n):r(e,s))||n);return o>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),r=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&r.set(e,t))}return t}toString(){return this.cssText}};const n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,f=u.trustedTypes,_=f?f.emptyScript:"",m=u.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},$=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);r?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),r=e.litNonce;void 0!==r&&i.setAttribute("nonce",r),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const r=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==r?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const o=r.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,r){if(void 0!==t){const o=this.constructor;if(!1===i&&(r=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??$)(r,e)||s.useDefault&&s.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:r},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==r||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[g("elementProperties")]=new Map,v[g("finalized")]=new Map,m?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,x=t=>t,A=w.trustedTypes,E=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,P=`<${C}>`,M=document,O=()=>M.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,D=/>/g,j=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),z=/'/g,L=/"/g,B=/^(?:script|style|textarea|title)$/i,I=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,F=M.createTreeWalker(M,129);function K(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let r,o=2===e?"<svg>":3===e?"<math>":"",n=R;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,d=0;for(;d<s.length&&(n.lastIndex=d,l=n.exec(s),null!==l);)d=n.lastIndex,n===R?"!--"===l[1]?n=N:void 0!==l[1]?n=D:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),n=j):void 0!==l[3]&&(n=j):n===j?">"===l[0]?(n=r??R,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?j:'"'===l[3]?L:z):n===L||n===z?n=j:n===N||n===D?n=R:(n=j,r=void 0);const h=n===j&&t[e+1].startsWith("/>")?" ":"";o+=n===R?s+P:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+k+h):s+k+(-2===c?e:h)}return[K(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const n=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=X.createElement(l,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[o++],s=i.getAttribute(t).split(k),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:n[2],strings:s,ctor:"."===n[1]?tt:"?"===n[1]?et:"@"===n[1]?st:Y}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:r}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],O()),F.nextNode(),a.push({type:2,index:++r});i.append(t[e],O())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:r}),t+=k.length-1}r++}}static createElement(t,e){const s=M.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===V)return e;let r=void 0!==i?s._$Co?.[i]:s._$Cl;const o=U(e)?void 0:e._$litDirective$;return r?.constructor!==o&&(r?._$AO?.(!1),void 0===o?r=void 0:(r=new o(t),r._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=r:s._$Cl=r),void 0!==r&&(e=Z(t,r._$AS(t,e.values),r,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);F.currentNode=i;let r=F.nextNode(),o=0,n=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new Q(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new it(r,this,t)),this._$AV.push(e),a=s[++n]}o!==a?.index&&(r=F.nextNode(),o++)}return F.currentNode=M,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Q{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),U(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=X.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new X(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new Q(this.O(O()),this.O(O()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(void 0===r)t=Z(this,t,e,0),o=!U(t)||t!==this._$AH&&t!==V,o&&(this._$AH=t);else{const i=t;let n,a;for(t=r[0],n=0;n<r.length-1;n++)a=Z(this,i[s+n],e,n),a===V&&(a=this._$AH[n]),o||=!U(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+r[n+1]),this._$AH[n]=a}o&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class st extends Y{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===V)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class it{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(X,Q),(w.litHtmlVersions??=[]).push("3.3.3");const ot=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class nt extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let r=i._$litPart$;if(void 0===r){const t=s?.renderBefore??null;i._$litPart$=r=new Q(e.insertBefore(O(),t),t,void 0,s??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}nt._$litElement$=!0,nt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:nt});const at=ot.litElementPolyfillSupport;at?.({LitElement:nt}),(ot.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const lt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},ct=(t=lt,e,s)=>{const{kind:i,metadata:r}=s;let o=globalThis.litPropertyMetadata.get(r);if(void 0===o&&globalThis.litPropertyMetadata.set(r,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const r=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,r,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const r=this[i];e.call(this,s),this.requestUpdate(i,r,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function dt(t){return(e,s)=>"object"==typeof s?ct(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return dt({...t,state:!0,attribute:!1})}const pt={en:{tabs:{active_mode:"Active mode"},timeline:{edit:"Edit schedules",back:"Back to timeline",empty:"No schedule on that day",next:"{value} at {time}",on:"On",off:"Off"},mode_bar:{current:"Current mode: {mode}",activate:"Activate {mode}"},scheduler:{next_run:"Next run",days:"Schedule"},errors:{no_modes:"No mode to show: {entity} has no options.",schedules_unavailable:"Could not read the schedules: is the Scheduler integration installed?"}},fr:{tabs:{active_mode:"Mode actif"},timeline:{edit:"Modifier les planifications",back:"Retour à la frise",empty:"Aucune planification ce jour-là",next:"{value} à {time}",on:"Allumé",off:"Éteint"},mode_bar:{current:"Mode actuel : {mode}",activate:"Activer {mode}"},scheduler:{next_run:"Prochain lancement",days:"Planification"},errors:{no_modes:"Aucun mode à afficher : {entity} n'a pas d'options.",schedules_unavailable:"Impossible de lire les planifications : l'intégration Scheduler est-elle installée ?"}}};function ut(t,e){return e.split(".").reduce((t,e)=>t&&null!=t[e]?t[e]:void 0,t)}function ft(t,e,s,i){const r=function(t){const e=t?.locale?.language||t?.language||"en",s=String(e).split("-")[0];return pt[e]?e:pt[s]?s:"en"}(t);let o=ut(pt[r],e)??ut(pt.en,e)??i;return null==o?e:(s&&Object.entries(s).forEach(([t,e])=>o=o.replace(`{${t}}`,e)),o)}function _t(t,e){const s=e?.states?.[t.mode_entity??""]?.state;return s&&"unavailable"!==s&&"unknown"!==s?s:void 0}const mt=1440,gt=["sun","mon","tue","wed","thu","fri","sat"];function yt(t){const[e,s]=t.split(":").map(Number);return 60*e+(s||0)}function $t(t){const e=t%mt;return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`}const bt=t=>t.service.startsWith("climate.");function vt(t){return t.timeslots.some(t=>t.actions.some(bt))}function wt(t){const e=vt(t),s=t.timeslots.filter(t=>!e||t.actions.some(bt)).map(t=>({slot:t,start:yt(t.start)})).sort((t,e)=>t.start-e.start),i=[];return s.forEach(({slot:t,start:e},r)=>{const o=function(t){const e=t.actions?.find(bt)??t.actions?.[0];if(!e)return{kind:"other",label:""};const[,s]=e.service.split("."),i=e.service_data??{},r=e.entity_id,o=i.hvac_mode;if("off"===o)return{kind:"off",entity:r,hvacMode:o,label:o};if("turn_off"===s)return{kind:"off",entity:r,label:"off"};if("number"==typeof i.temperature)return{kind:"cool"===o?"cool":"heat",entity:r,temperature:i.temperature,label:`${i.temperature}°`};if(null!=i.preset_mode){const t=String(i.preset_mode);return{kind:"preset",entity:r,preset:t,label:t}}return o?{kind:"cool"===o?"cool":"heat",entity:r,hvacMode:o,label:o}:"turn_on"===s?{kind:"on",entity:r,label:"on"}:{kind:"other",entity:r,label:s??e.service}}(t);let n;if(null!=t.stop)n=yt(t.stop),n<=e&&(n+=mt);else{const t=s[(r+1)%s.length].start;n=t>e?t:t+mt}n>mt?(i.push({start:e,end:mt,value:o}),n-mt>0&&i.push({start:0,end:n-mt,value:o})):i.push({start:e,end:n,value:o})}),i.filter(t=>t.end>t.start).sort((t,e)=>t.start-e.start)}function xt(t,e=!1){const s=e&&vt(t),i=t.timeslots.flatMap(t=>t.actions.filter(t=>!s||bt(t)).map(t=>t.entity_id).filter(t=>!!t));return[...new Set(i)]}const At=[1,2,3,4,5,6,0],Et={heat:"mdi:radiator",cool:"mdi:snowflake",preset:"mdi:thermostat",on:"mdi:toggle-switch-outline",off:"mdi:toggle-switch-off-outline",other:"mdi:calendar-clock"};class St extends nt{constructor(){super(...arguments),this._cardsVersion=0,this._cards=new Map,this._building=new Set,this._schedulesError=!1,this._day=(new Date).getDay(),this._editing=!1}connectedCallback(){super.connectedCallback(),this._clock=setInterval(()=>this.requestUpdate(),6e4)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._clock)}static getStubConfig(){return{mode_entity:"select.homeshift_day_mode",entities:[]}}setConfig(t){!function(t){if(!t)throw new Error("Invalid configuration");if(!t.mode_entity&&!t.modes?.length)throw new Error("Set `mode_entity` (a select) or a list of `modes`.");if(null!=t.entities&&!Array.isArray(t.entities))throw new Error("`entities` must be a list of entity ids.");for(const e of t.modes??[])if("string"!=typeof e&&!e?.name)throw new Error("Each entry of `modes` needs a `name`.")}(t),this._config=t,this._cards=new Map,this._building.clear()}getCardSize(){return 6}getGridOptions(){return{columns:12,min_columns:6}}get _modes(){return function(t,e){const s=e?.states?.[t.mode_entity??""]?.attributes?.options??[];return(t.modes?.length?t.modes:s).map(e=>{const s="string"==typeof e?{name:e}:e,i=[...t.entities??[],...s.entities??[],...t.extra_entities?.[s.name]??[]];return{name:s.name,label:s.label??s.name,tag:s.tag??s.name,entities:[...new Set(i)]}})}(this._config,this.hass)}willUpdate(t){if(!t.has("hass")||!this.hass)return;const e=_t(this._config,this.hass),s=this._modes,i=!1!==this._config.follow_mode&&e!==this._lastActive;e&&s.some(t=>t.name===e)&&(i||!this._selected)?this._selected=e:s.some(t=>t.name===this._selected)||(this._selected=s[0]?.name),this._lastActive=e,this._timeline&&this._refreshSchedules()}get _timeline(){return"list"!==this._config.layout}_refreshSchedules(){const t=Object.values(this.hass.states).filter(t=>t.entity_id.startsWith("switch.schedule")).map(t=>`${t.entity_id}:${t.last_updated}`).join("|");t!==this._schedulesKey&&(this._schedulesKey=t,this.hass.callWS({type:"scheduler"}).then(t=>{this._schedules=t,this._schedulesError=!1}).catch(()=>{this._schedulesError=!0}))}updated(){const t=this._selected?this._cards.get(this._selected):void 0;t&&t.hass!==this.hass&&(t.hass=this.hass)}_card(t){const e=this._cards.get(t.name);if(e)return e;this._building.has(t.name)||(this._building.add(t.name),this._buildCard(t).finally(()=>this._building.delete(t.name)))}async _buildCard(t){const e=function(t,e,s){return{title:!1,discover_existing:!1,show_header_toggle:!1,time_step:5,sort_by:["title"],display_options:{primary_info:[`<i><b><font color="${t.name_color??"orange"}">{name}</font></b></i>`],secondary_info:[`<i><b>${ft(s,"scheduler.next_run")}</b></i> {relative-time}`,`<i><b>${ft(s,"scheduler.days")}</b></i> {days}`,"additional-tasks"],icon:"entity"},...t.scheduler,type:"custom:scheduler-card",tags:[e.tag],...e.entities.length?{include:e.entities}:{}}}(this._config,t,this.hass),s=this._cards;this._helpers??(this._helpers=window.loadCardHelpers?.()??Promise.resolve(void 0));const i=await this._helpers;let r;i?r=i.createCardElement(e):(await customElements.whenDefined("scheduler-card"),r=document.createElement("scheduler-card"),r.setConfig(e)),s===this._cards&&(r.addEventListener("ll-rebuild",e=>{e.stopPropagation(),this._cards.delete(t.name),this._cardsVersion++}),r.hass=this.hass,this._cards.set(t.name,r),this._cardsVersion++)}_select(t){this._selected=t,this._editing=!1}_onTabKeydown(t,e){const s={ArrowRight:1,ArrowLeft:-1}[t.key];if(!s)return;const i=e.findIndex(t=>t.name===this._selected),r=e[(i+s+e.length)%e.length];this._select(r.name),t.preventDefault(),this.updateComplete.then(()=>this.shadowRoot?.querySelector('[aria-selected="true"]')?.focus())}_activate(t){const e=this._config.mode_entity,s=e.split(".")[0];this.hass.callService(s,"select_option",{entity_id:e,option:t})}render(){if(!this._config||!this.hass)return W;const t=this._modes;if(!t.length)return I`<ha-alert alert-type="warning">
        ${ft(this.hass,"errors.no_modes",{entity:this._config.mode_entity??""})}
      </ha-alert>`;const e=_t(this._config,this.hass),s=t.find(t=>t.name===this._selected)??t[0],i=this._config.accent_color??"#44739E";return I`
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
        ${this._renderModeBar(s,e,t)}
        <div class="content" role="tabpanel">${this._renderContent(s)}</div>
      </div>
    `}_renderContent(t){return this._timeline?this._editing?I`
        <button class="link" @click=${()=>this._editing=!1}>
          <ha-icon icon="mdi:chart-timeline"></ha-icon>${ft(this.hass,"timeline.back")}
        </button>
        ${this._card(t)??W}
      `:this._renderTimeline(t):this._card(t)??W}_renderTimeline(t){if(this._schedulesError)return I`<ha-alert alert-type="error">${ft(this.hass,"errors.schedules_unavailable")}</ha-alert>`;const e=(new Date).getDay(),s=this._day===e,i=new Date,r=60*i.getHours()+i.getMinutes(),o=function(t,e,s){return t.filter(t=>t.tags?.includes(e)).filter(t=>!s.length||xt(t).some(t=>s.includes(t))).sort((t,e)=>t.name.localeCompare(e.name))}(this._schedules??[],t.tag,t.entities).filter(t=>function(t,e){const s=t.weekdays??[];return!!s.includes("daily")||!!(s.includes("workday")&&e>=1&&e<=5)||!(!s.includes("weekend")||0!==e&&6!==e)||s.includes(gt[e])}(t,this._day));return I`
      <div class="timeline">
        <div class="days">
          ${At.map(t=>I`
              <button
                class="day ${t===this._day?"selected":""} ${t===e?"today":""}"
                aria-pressed=${t===this._day?"true":"false"}
                @click=${()=>this._day=t}
              >
                ${this._dayLabel(t)}
              </button>
            `)}
        </div>
        ${this._schedules&&!o.length?I`<div class="empty">${ft(this.hass,"timeline.empty")}</div>`:I`
              ${o.map(t=>this._renderRow(t,s?r:void 0))}
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
    `}_renderRow(t,e){const s=wt(t),i=xt(t,!0),r=1===i.length?this.hass.states[i[0]]?.attributes?.friendly_name??i[0]:t.name,o=function(t){const e=new Set(t.map(t=>t.value.kind));return["cool","heat","preset","on","off"].find(t=>e.has(t))??"other"}(s),n=this.hass.states[t.entity_id]?"off"!==this.hass.states[t.entity_id].state:t.enabled,a=null!=e&&n?s.find(t=>t.start>e):void 0;return I`
      <div class="row ${n?"":"disabled"}" title=${t.name}>
        <div class="row-head">
          <ha-icon class="kind ${o}" icon=${Et[o]}></ha-icon>
          <span class="row-name">${r}</span>
          ${a?I`<span class="row-next">
                ${ft(this.hass,"timeline.next",{value:this._label(a.value),time:$t(a.start)})}
              </span>`:W}
          <button
            class="switch ${n?"on":""}"
            role="switch"
            aria-checked=${n?"true":"false"}
            aria-label=${t.name}
            @click=${()=>this._toggle(t.entity_id,n)}
          ></button>
        </div>
        <div class="bar">
          ${s.map(t=>this._renderSegment(t))}
          ${null!=e?I`<div class="now" style="left: ${e/mt*100}%"></div>`:W}
        </div>
      </div>
    `}_renderSegment(t){const{background:e,color:s}=function(t){switch(t.kind){case"cool":return{background:"#378ADD",color:"#fff"};case"off":return{background:"var(--divider-color, #5F5E5A)",color:"var(--secondary-text-color)"};case"on":return{background:"#1D9E75",color:"#fff"};case"other":return{background:"#888780",color:"#fff"};case"preset":return function(t){const e=t.toLowerCase();return/frost|hors|away|absen|vacation/.test(e)?{background:"#85B7EB",color:"#042C53"}:/eco|sleep|night|nuit/.test(e)?{background:"#FAC775",color:"#412402"}:/boost/.test(e)?{background:"#A32D2D",color:"#fff"}:/comfort|confort|home|activity/.test(e)?{background:"#EF9F27",color:"#412402"}:{background:"#B4B2A9",color:"#2C2C2A"}}(t.preset??"")}const e=t.temperature??19;return e<15?{background:"#85B7EB",color:"#042C53"}:e<17.5?{background:"#FAC775",color:"#412402"}:e<19.5?{background:"#EF9F27",color:"#412402"}:e<21?{background:"#D85A30",color:"#fff"}:{background:"#A32D2D",color:"#fff"}}(t.value),i=(t.end-t.start)/mt*100,r=`${$t(t.start)} – ${$t(t.end)}`;return I`<div
      class="segment"
      style="left: ${t.start/mt*100}%; width: ${i}%; background: ${e}; color: ${s}"
      title="${r} · ${this._label(t.value)}"
    >
      ${i>=8?this._label(t.value):W}
    </div>`}_label(t){const e=t.entity?this.hass.states[t.entity]:void 0;if(null!=t.temperature){const e=this.hass.locale?.language??this.hass.language??"en";return`${t.temperature.toLocaleString(e)}°`}return null!=t.preset?e&&this.hass.formatEntityAttributeValue?this.hass.formatEntityAttributeValue(e,"preset_mode",t.preset):t.preset:null!=t.hvacMode?e&&this.hass.formatEntityState?this.hass.formatEntityState(e,t.hvacMode):t.hvacMode:"on"===t.kind||"off"===t.kind?ft(this.hass,`timeline.${t.kind}`):t.label}_dayLabel(t){const e=new Date(2024,0,7+t),s=this.hass.locale?.language??this.hass.language??"en";return e.toLocaleDateString(s,{weekday:"short"}).replace(".","")}_toggle(t,e){this.hass.callService("switch",e?"turn_off":"turn_on",{entity_id:t})}_renderModeBar(t,e,s){if(!1===this._config.allow_mode_change||!this._config.mode_entity||!e||t.name===e)return W;const i=s.find(t=>t.name===e)?.label??e;return I`
      <div class="mode-bar">
        <span>${ft(this.hass,"mode_bar.current",{mode:i})}</span>
        <button class="activate" @click=${()=>this._activate(t.name)}>
          ${ft(this.hass,"mode_bar.activate",{mode:t.label})}
        </button>
      </div>
    `}}St.styles=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,i)})`
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
    .mode-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
      margin: 8px 0 0;
      padding: 6px 6px 6px 12px;
      border-radius: 8px;
      background: color-mix(in srgb, var(--hsc-accent) 15%, transparent);
      color: var(--secondary-text-color);
      font-size: 14px;
    }
    .activate {
      border: none;
      border-radius: 6px;
      padding: 6px 12px;
      background: var(--hsc-accent);
      color: #fff;
      font: inherit;
      font-weight: 500;
      cursor: pointer;
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
    .days {
      display: flex;
      gap: 4px;
    }
    .day {
      flex: 1;
      padding: 4px 0;
      border: 1px solid var(--divider-color);
      border-radius: 14px;
      background: none;
      color: var(--secondary-text-color);
      font: inherit;
      font-size: 12px;
      cursor: pointer;
      text-transform: capitalize;
    }
    .day.today {
      font-weight: 600;
      color: var(--primary-text-color);
    }
    .day.selected {
      background: color-mix(in srgb, var(--hsc-accent) 25%, transparent);
      border-color: var(--hsc-accent);
      color: var(--primary-text-color);
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .row.disabled .bar {
      opacity: 0.35;
    }
    .row.disabled .row-name {
      color: var(--secondary-text-color);
    }
    .row-head {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
    }
    .kind {
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
    .row-name {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-weight: 500;
    }
    .row-next {
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
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
      margin-top: -6px;
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
  `,t([dt({attribute:!1})],St.prototype,"hass",void 0),t([ht()],St.prototype,"_config",void 0),t([ht()],St.prototype,"_selected",void 0),t([ht()],St.prototype,"_cardsVersion",void 0),t([ht()],St.prototype,"_schedules",void 0),t([ht()],St.prototype,"_schedulesError",void 0),t([ht()],St.prototype,"_day",void 0),t([ht()],St.prototype,"_editing",void 0),customElements.define("homeshift-schedule-card",St),window.customCards=window.customCards||[],window.customCards.push({type:"homeshift-schedule-card",name:"HomeShift Schedule Card",description:"Scheduler schedules per day mode, as 24 h timelines in tabs following a select.",preview:!1});
