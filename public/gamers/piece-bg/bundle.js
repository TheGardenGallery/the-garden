(()=>{var fr=Object.defineProperty;var _t=(e,t)=>{for(var i in t)fr(e,i,{get:t[i],enumerable:!0})};var L=typeof Float32Array<"u"?Float32Array:Array,tt=Math.random,Fe="zyx";function ut(e){return e>=0?Math.round(e):e%.5===0?Math.floor(e):Math.round(e)}var Zo=Math.PI/180,Ko=180/Math.PI;var bt={};_t(bt,{add:()=>Lr,adjoint:()=>wr,clone:()=>pr,copy:()=>ur,create:()=>le,determinant:()=>Pr,equals:()=>_r,exactEquals:()=>Or,frob:()=>Vr,fromMat2d:()=>Sr,fromMat4:()=>mr,fromQuat:()=>Fr,fromRotation:()=>Cr,fromScaling:()=>zr,fromTranslation:()=>Rr,fromValues:()=>gr,identity:()=>Mr,invert:()=>Ar,mul:()=>qr,multiply:()=>Ie,multiplyScalar:()=>Ur,multiplyScalarAndAdd:()=>Nr,normalFromMat4:()=>Ir,projection:()=>Dr,rotate:()=>Tr,scale:()=>Er,set:()=>vr,str:()=>Br,sub:()=>Yr,subtract:()=>De,translate:()=>br,transpose:()=>yr});function le(){let e=new L(9);return L!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function mr(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[4],e[4]=t[5],e[5]=t[6],e[6]=t[8],e[7]=t[9],e[8]=t[10],e}function pr(e){let t=new L(9);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t}function ur(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function gr(e,t,i,r,n,s,o,a,l){let c=new L(9);return c[0]=e,c[1]=t,c[2]=i,c[3]=r,c[4]=n,c[5]=s,c[6]=o,c[7]=a,c[8]=l,c}function vr(e,t,i,r,n,s,o,a,l,c){return e[0]=t,e[1]=i,e[2]=r,e[3]=n,e[4]=s,e[5]=o,e[6]=a,e[7]=l,e[8]=c,e}function Mr(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function yr(e,t){if(e===t){let i=t[1],r=t[2],n=t[5];e[1]=t[3],e[2]=t[6],e[3]=i,e[5]=t[7],e[6]=r,e[7]=n}else e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8];return e}function Ar(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,d=-h*s+a*l,u=c*s-o*l,m=i*f+r*d+n*u;return m?(m=1/m,e[0]=f*m,e[1]=(-h*r+n*c)*m,e[2]=(a*r-n*o)*m,e[3]=d*m,e[4]=(h*i-n*l)*m,e[5]=(-a*i+n*s)*m,e[6]=u*m,e[7]=(-c*i+r*l)*m,e[8]=(o*i-r*s)*m,e):null}function wr(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e[0]=o*h-a*c,e[1]=n*c-r*h,e[2]=r*a-n*o,e[3]=a*l-s*h,e[4]=i*h-n*l,e[5]=n*s-i*a,e[6]=s*c-o*l,e[7]=r*l-i*c,e[8]=i*o-r*s,e}function Pr(e){let t=e[0],i=e[1],r=e[2],n=e[3],s=e[4],o=e[5],a=e[6],l=e[7],c=e[8];return t*(c*s-o*l)+i*(-c*n+o*a)+r*(l*n-s*a)}function Ie(e,t,i){let r=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],f=t[8],d=i[0],u=i[1],m=i[2],g=i[3],p=i[4],v=i[5],A=i[6],y=i[7],M=i[8];return e[0]=d*r+u*o+m*c,e[1]=d*n+u*a+m*h,e[2]=d*s+u*l+m*f,e[3]=g*r+p*o+v*c,e[4]=g*n+p*a+v*h,e[5]=g*s+p*l+v*f,e[6]=A*r+y*o+M*c,e[7]=A*n+y*a+M*h,e[8]=A*s+y*l+M*f,e}function br(e,t,i){let r=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],f=t[8],d=i[0],u=i[1];return e[0]=r,e[1]=n,e[2]=s,e[3]=o,e[4]=a,e[5]=l,e[6]=d*r+u*o+c,e[7]=d*n+u*a+h,e[8]=d*s+u*l+f,e}function Tr(e,t,i){let r=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],f=t[8],d=Math.sin(i),u=Math.cos(i);return e[0]=u*r+d*o,e[1]=u*n+d*a,e[2]=u*s+d*l,e[3]=u*o-d*r,e[4]=u*a-d*n,e[5]=u*l-d*s,e[6]=c,e[7]=h,e[8]=f,e}function Er(e,t,i){let r=i[0],n=i[1];return e[0]=r*t[0],e[1]=r*t[1],e[2]=r*t[2],e[3]=n*t[3],e[4]=n*t[4],e[5]=n*t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e}function Rr(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=1,e[5]=0,e[6]=t[0],e[7]=t[1],e[8]=1,e}function Cr(e,t){let i=Math.sin(t),r=Math.cos(t);return e[0]=r,e[1]=i,e[2]=0,e[3]=-i,e[4]=r,e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function zr(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=t[1],e[5]=0,e[6]=0,e[7]=0,e[8]=1,e}function Sr(e,t){return e[0]=t[0],e[1]=t[1],e[2]=0,e[3]=t[2],e[4]=t[3],e[5]=0,e[6]=t[4],e[7]=t[5],e[8]=1,e}function Fr(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=i+i,a=r+r,l=n+n,c=i*o,h=r*o,f=r*a,d=n*o,u=n*a,m=n*l,g=s*o,p=s*a,v=s*l;return e[0]=1-f-m,e[3]=h-v,e[6]=d+p,e[1]=h+v,e[4]=1-c-m,e[7]=u-g,e[2]=d-p,e[5]=u+g,e[8]=1-c-f,e}function Ir(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],g=t[13],p=t[14],v=t[15],A=i*a-r*o,y=i*l-n*o,M=i*c-s*o,w=r*l-n*a,P=r*c-s*a,T=n*c-s*l,S=h*g-f*m,R=h*p-d*m,E=h*v-u*m,B=f*p-d*g,F=f*v-u*g,V=d*v-u*p,C=A*V-y*F+M*B+w*E-P*R+T*S;return C?(C=1/C,e[0]=(a*V-l*F+c*B)*C,e[1]=(l*E-o*V-c*R)*C,e[2]=(o*F-a*E+c*S)*C,e[3]=(n*F-r*V-s*B)*C,e[4]=(i*V-n*E+s*R)*C,e[5]=(r*E-i*F-s*S)*C,e[6]=(g*T-p*P+v*w)*C,e[7]=(p*M-m*T-v*y)*C,e[8]=(m*P-g*M+v*A)*C,e):null}function Dr(e,t,i){return e[0]=2/t,e[1]=0,e[2]=0,e[3]=0,e[4]=-2/i,e[5]=0,e[6]=-1,e[7]=1,e[8]=1,e}function Br(e){return"mat3("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+")"}function Vr(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]+e[3]*e[3]+e[4]*e[4]+e[5]*e[5]+e[6]*e[6]+e[7]*e[7]+e[8]*e[8])}function Lr(e,t,i){return e[0]=t[0]+i[0],e[1]=t[1]+i[1],e[2]=t[2]+i[2],e[3]=t[3]+i[3],e[4]=t[4]+i[4],e[5]=t[5]+i[5],e[6]=t[6]+i[6],e[7]=t[7]+i[7],e[8]=t[8]+i[8],e}function De(e,t,i){return e[0]=t[0]-i[0],e[1]=t[1]-i[1],e[2]=t[2]-i[2],e[3]=t[3]-i[3],e[4]=t[4]-i[4],e[5]=t[5]-i[5],e[6]=t[6]-i[6],e[7]=t[7]-i[7],e[8]=t[8]-i[8],e}function Ur(e,t,i){return e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e[3]=t[3]*i,e[4]=t[4]*i,e[5]=t[5]*i,e[6]=t[6]*i,e[7]=t[7]*i,e[8]=t[8]*i,e}function Nr(e,t,i,r){return e[0]=t[0]+i[0]*r,e[1]=t[1]+i[1]*r,e[2]=t[2]+i[2]*r,e[3]=t[3]+i[3]*r,e[4]=t[4]+i[4]*r,e[5]=t[5]+i[5]*r,e[6]=t[6]+i[6]*r,e[7]=t[7]+i[7]*r,e[8]=t[8]+i[8]*r,e}function Or(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]}function _r(e,t){let i=e[0],r=e[1],n=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],f=t[0],d=t[1],u=t[2],m=t[3],g=t[4],p=t[5],v=t[6],A=t[7],y=t[8];return Math.abs(i-f)<=1e-6*Math.max(1,Math.abs(i),Math.abs(f))&&Math.abs(r-d)<=1e-6*Math.max(1,Math.abs(r),Math.abs(d))&&Math.abs(n-u)<=1e-6*Math.max(1,Math.abs(n),Math.abs(u))&&Math.abs(s-m)<=1e-6*Math.max(1,Math.abs(s),Math.abs(m))&&Math.abs(o-g)<=1e-6*Math.max(1,Math.abs(o),Math.abs(g))&&Math.abs(a-p)<=1e-6*Math.max(1,Math.abs(a),Math.abs(p))&&Math.abs(l-v)<=1e-6*Math.max(1,Math.abs(l),Math.abs(v))&&Math.abs(c-A)<=1e-6*Math.max(1,Math.abs(c),Math.abs(A))&&Math.abs(h-y)<=1e-6*Math.max(1,Math.abs(h),Math.abs(y))}var qr=Ie,Yr=De;var D={};_t(D,{add:()=>En,adjoint:()=>Kr,clone:()=>Wr,copy:()=>Gr,create:()=>Xr,decompose:()=>dn,determinant:()=>Qr,equals:()=>Sn,exactEquals:()=>zn,frob:()=>Tn,fromQuat:()=>pn,fromQuat2:()=>fn,fromRotation:()=>an,fromRotationTranslation:()=>Le,fromRotationTranslationScale:()=>xn,fromRotationTranslationScaleOrigin:()=>mn,fromScaling:()=>on,fromTranslation:()=>sn,fromValues:()=>kr,fromXRotation:()=>ln,fromYRotation:()=>cn,fromZRotation:()=>hn,frustum:()=>un,getRotation:()=>Oe,getScaling:()=>Ne,getTranslation:()=>Ue,identity:()=>Be,invert:()=>Zr,lookAt:()=>wn,mul:()=>Fn,multiply:()=>Ve,multiplyScalar:()=>Rn,multiplyScalarAndAdd:()=>Cn,ortho:()=>yn,orthoNO:()=>qe,orthoZO:()=>An,perspective:()=>gn,perspectiveFromFieldOfView:()=>Mn,perspectiveNO:()=>_e,perspectiveZO:()=>vn,rotate:()=>tn,rotateX:()=>en,rotateY:()=>rn,rotateZ:()=>nn,scale:()=>$r,set:()=>Hr,str:()=>bn,sub:()=>In,subtract:()=>Ye,targetTo:()=>Pn,translate:()=>Jr,transpose:()=>jr});function Xr(){let e=new L(16);return L!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Wr(e){let t=new L(16);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t}function Gr(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function kr(e,t,i,r,n,s,o,a,l,c,h,f,d,u,m,g){let p=new L(16);return p[0]=e,p[1]=t,p[2]=i,p[3]=r,p[4]=n,p[5]=s,p[6]=o,p[7]=a,p[8]=l,p[9]=c,p[10]=h,p[11]=f,p[12]=d,p[13]=u,p[14]=m,p[15]=g,p}function Hr(e,t,i,r,n,s,o,a,l,c,h,f,d,u,m,g,p){return e[0]=t,e[1]=i,e[2]=r,e[3]=n,e[4]=s,e[5]=o,e[6]=a,e[7]=l,e[8]=c,e[9]=h,e[10]=f,e[11]=d,e[12]=u,e[13]=m,e[14]=g,e[15]=p,e}function Be(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function jr(e,t){if(e===t){let i=t[1],r=t[2],n=t[3],s=t[6],o=t[7],a=t[11];e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=i,e[6]=t[9],e[7]=t[13],e[8]=r,e[9]=s,e[11]=t[14],e[12]=n,e[13]=o,e[14]=a}else e[0]=t[0],e[1]=t[4],e[2]=t[8],e[3]=t[12],e[4]=t[1],e[5]=t[5],e[6]=t[9],e[7]=t[13],e[8]=t[2],e[9]=t[6],e[10]=t[10],e[11]=t[14],e[12]=t[3],e[13]=t[7],e[14]=t[11],e[15]=t[15];return e}function Zr(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],g=t[13],p=t[14],v=t[15],A=i*a-r*o,y=i*l-n*o,M=i*c-s*o,w=r*l-n*a,P=r*c-s*a,T=n*c-s*l,S=h*g-f*m,R=h*p-d*m,E=h*v-u*m,B=f*p-d*g,F=f*v-u*g,V=d*v-u*p,C=A*V-y*F+M*B+w*E-P*R+T*S;return C?(C=1/C,e[0]=(a*V-l*F+c*B)*C,e[1]=(n*F-r*V-s*B)*C,e[2]=(g*T-p*P+v*w)*C,e[3]=(d*P-f*T-u*w)*C,e[4]=(l*E-o*V-c*R)*C,e[5]=(i*V-n*E+s*R)*C,e[6]=(p*M-m*T-v*y)*C,e[7]=(h*T-d*M+u*y)*C,e[8]=(o*F-a*E+c*S)*C,e[9]=(r*E-i*F-s*S)*C,e[10]=(m*P-g*M+v*A)*C,e[11]=(f*M-h*P-u*A)*C,e[12]=(a*R-o*B-l*S)*C,e[13]=(i*B-r*R+n*S)*C,e[14]=(g*y-m*w-p*A)*C,e[15]=(h*w-f*y+d*A)*C,e):null}function Kr(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],d=t[10],u=t[11],m=t[12],g=t[13],p=t[14],v=t[15],A=i*a-r*o,y=i*l-n*o,M=i*c-s*o,w=r*l-n*a,P=r*c-s*a,T=n*c-s*l,S=h*g-f*m,R=h*p-d*m,E=h*v-u*m,B=f*p-d*g,F=f*v-u*g,V=d*v-u*p;return e[0]=a*V-l*F+c*B,e[1]=n*F-r*V-s*B,e[2]=g*T-p*P+v*w,e[3]=d*P-f*T-u*w,e[4]=l*E-o*V-c*R,e[5]=i*V-n*E+s*R,e[6]=p*M-m*T-v*y,e[7]=h*T-d*M+u*y,e[8]=o*F-a*E+c*S,e[9]=r*E-i*F-s*S,e[10]=m*P-g*M+v*A,e[11]=f*M-h*P-u*A,e[12]=a*R-o*B-l*S,e[13]=i*B-r*R+n*S,e[14]=g*y-m*w-p*A,e[15]=h*w-f*y+d*A,e}function Qr(e){let t=e[0],i=e[1],r=e[2],n=e[3],s=e[4],o=e[5],a=e[6],l=e[7],c=e[8],h=e[9],f=e[10],d=e[11],u=e[12],m=e[13],g=e[14],p=e[15],v=t*o-i*s,A=t*a-r*s,y=i*a-r*o,M=c*m-h*u,w=c*g-f*u,P=h*g-f*m,T=t*P-i*w+r*M,S=s*P-o*w+a*M,R=c*y-h*A+f*v,E=u*y-m*A+g*v;return l*T-n*S+p*R-d*E}function Ve(e,t,i){let r=t[0],n=t[1],s=t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],f=t[8],d=t[9],u=t[10],m=t[11],g=t[12],p=t[13],v=t[14],A=t[15],y=i[0],M=i[1],w=i[2],P=i[3];return e[0]=y*r+M*a+w*f+P*g,e[1]=y*n+M*l+w*d+P*p,e[2]=y*s+M*c+w*u+P*v,e[3]=y*o+M*h+w*m+P*A,y=i[4],M=i[5],w=i[6],P=i[7],e[4]=y*r+M*a+w*f+P*g,e[5]=y*n+M*l+w*d+P*p,e[6]=y*s+M*c+w*u+P*v,e[7]=y*o+M*h+w*m+P*A,y=i[8],M=i[9],w=i[10],P=i[11],e[8]=y*r+M*a+w*f+P*g,e[9]=y*n+M*l+w*d+P*p,e[10]=y*s+M*c+w*u+P*v,e[11]=y*o+M*h+w*m+P*A,y=i[12],M=i[13],w=i[14],P=i[15],e[12]=y*r+M*a+w*f+P*g,e[13]=y*n+M*l+w*d+P*p,e[14]=y*s+M*c+w*u+P*v,e[15]=y*o+M*h+w*m+P*A,e}function Jr(e,t,i){let r=i[0],n=i[1],s=i[2],o,a,l,c,h,f,d,u,m,g,p,v;return t===e?(e[12]=t[0]*r+t[4]*n+t[8]*s+t[12],e[13]=t[1]*r+t[5]*n+t[9]*s+t[13],e[14]=t[2]*r+t[6]*n+t[10]*s+t[14],e[15]=t[3]*r+t[7]*n+t[11]*s+t[15]):(o=t[0],a=t[1],l=t[2],c=t[3],h=t[4],f=t[5],d=t[6],u=t[7],m=t[8],g=t[9],p=t[10],v=t[11],e[0]=o,e[1]=a,e[2]=l,e[3]=c,e[4]=h,e[5]=f,e[6]=d,e[7]=u,e[8]=m,e[9]=g,e[10]=p,e[11]=v,e[12]=o*r+h*n+m*s+t[12],e[13]=a*r+f*n+g*s+t[13],e[14]=l*r+d*n+p*s+t[14],e[15]=c*r+u*n+v*s+t[15]),e}function $r(e,t,i){let r=i[0],n=i[1],s=i[2];return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*n,e[5]=t[5]*n,e[6]=t[6]*n,e[7]=t[7]*n,e[8]=t[8]*s,e[9]=t[9]*s,e[10]=t[10]*s,e[11]=t[11]*s,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function tn(e,t,i,r){let n=r[0],s=r[1],o=r[2],a=Math.sqrt(n*n+s*s+o*o),l,c,h,f,d,u,m,g,p,v,A,y,M,w,P,T,S,R,E,B,F,V,C,N;return a<1e-6?null:(a=1/a,n*=a,s*=a,o*=a,l=Math.sin(i),c=Math.cos(i),h=1-c,f=t[0],d=t[1],u=t[2],m=t[3],g=t[4],p=t[5],v=t[6],A=t[7],y=t[8],M=t[9],w=t[10],P=t[11],T=n*n*h+c,S=s*n*h+o*l,R=o*n*h-s*l,E=n*s*h-o*l,B=s*s*h+c,F=o*s*h+n*l,V=n*o*h+s*l,C=s*o*h-n*l,N=o*o*h+c,e[0]=f*T+g*S+y*R,e[1]=d*T+p*S+M*R,e[2]=u*T+v*S+w*R,e[3]=m*T+A*S+P*R,e[4]=f*E+g*B+y*F,e[5]=d*E+p*B+M*F,e[6]=u*E+v*B+w*F,e[7]=m*E+A*B+P*F,e[8]=f*V+g*C+y*N,e[9]=d*V+p*C+M*N,e[10]=u*V+v*C+w*N,e[11]=m*V+A*C+P*N,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function en(e,t,i){let r=Math.sin(i),n=Math.cos(i),s=t[4],o=t[5],a=t[6],l=t[7],c=t[8],h=t[9],f=t[10],d=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=s*n+c*r,e[5]=o*n+h*r,e[6]=a*n+f*r,e[7]=l*n+d*r,e[8]=c*n-s*r,e[9]=h*n-o*r,e[10]=f*n-a*r,e[11]=d*n-l*r,e}function rn(e,t,i){let r=Math.sin(i),n=Math.cos(i),s=t[0],o=t[1],a=t[2],l=t[3],c=t[8],h=t[9],f=t[10],d=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=s*n-c*r,e[1]=o*n-h*r,e[2]=a*n-f*r,e[3]=l*n-d*r,e[8]=s*r+c*n,e[9]=o*r+h*n,e[10]=a*r+f*n,e[11]=l*r+d*n,e}function nn(e,t,i){let r=Math.sin(i),n=Math.cos(i),s=t[0],o=t[1],a=t[2],l=t[3],c=t[4],h=t[5],f=t[6],d=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=s*n+c*r,e[1]=o*n+h*r,e[2]=a*n+f*r,e[3]=l*n+d*r,e[4]=c*n-s*r,e[5]=h*n-o*r,e[6]=f*n-a*r,e[7]=d*n-l*r,e}function sn(e,t){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=t[0],e[13]=t[1],e[14]=t[2],e[15]=1,e}function on(e,t){return e[0]=t[0],e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=t[1],e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=t[2],e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function an(e,t,i){let r=i[0],n=i[1],s=i[2],o=Math.sqrt(r*r+n*n+s*s),a,l,c;return o<1e-6?null:(o=1/o,r*=o,n*=o,s*=o,a=Math.sin(t),l=Math.cos(t),c=1-l,e[0]=r*r*c+l,e[1]=n*r*c+s*a,e[2]=s*r*c-n*a,e[3]=0,e[4]=r*n*c-s*a,e[5]=n*n*c+l,e[6]=s*n*c+r*a,e[7]=0,e[8]=r*s*c+n*a,e[9]=n*s*c-r*a,e[10]=s*s*c+l,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e)}function ln(e,t){let i=Math.sin(t),r=Math.cos(t);return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=r,e[6]=i,e[7]=0,e[8]=0,e[9]=-i,e[10]=r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function cn(e,t){let i=Math.sin(t),r=Math.cos(t);return e[0]=r,e[1]=0,e[2]=-i,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=i,e[9]=0,e[10]=r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function hn(e,t){let i=Math.sin(t),r=Math.cos(t);return e[0]=r,e[1]=i,e[2]=0,e[3]=0,e[4]=-i,e[5]=r,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function Le(e,t,i){let r=t[0],n=t[1],s=t[2],o=t[3],a=r+r,l=n+n,c=s+s,h=r*a,f=r*l,d=r*c,u=n*l,m=n*c,g=s*c,p=o*a,v=o*l,A=o*c;return e[0]=1-(u+g),e[1]=f+A,e[2]=d-v,e[3]=0,e[4]=f-A,e[5]=1-(h+g),e[6]=m+p,e[7]=0,e[8]=d+v,e[9]=m-p,e[10]=1-(h+u),e[11]=0,e[12]=i[0],e[13]=i[1],e[14]=i[2],e[15]=1,e}function fn(e,t){let i=new L(3),r=-t[0],n=-t[1],s=-t[2],o=t[3],a=t[4],l=t[5],c=t[6],h=t[7],f=r*r+n*n+s*s+o*o;return f>0?(i[0]=(a*o+h*r+l*s-c*n)*2/f,i[1]=(l*o+h*n+c*r-a*s)*2/f,i[2]=(c*o+h*s+a*n-l*r)*2/f):(i[0]=(a*o+h*r+l*s-c*n)*2,i[1]=(l*o+h*n+c*r-a*s)*2,i[2]=(c*o+h*s+a*n-l*r)*2),Le(e,t,i),e}function Ue(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function Ne(e,t){let i=t[0],r=t[1],n=t[2],s=t[4],o=t[5],a=t[6],l=t[8],c=t[9],h=t[10];return e[0]=Math.sqrt(i*i+r*r+n*n),e[1]=Math.sqrt(s*s+o*o+a*a),e[2]=Math.sqrt(l*l+c*c+h*h),e}function Oe(e,t){let i=new L(3);Ne(i,t);let r=1/i[0],n=1/i[1],s=1/i[2],o=t[0]*r,a=t[1]*n,l=t[2]*s,c=t[4]*r,h=t[5]*n,f=t[6]*s,d=t[8]*r,u=t[9]*n,m=t[10]*s,g=o+h+m,p=0;return g>0?(p=Math.sqrt(g+1)*2,e[3]=.25*p,e[0]=(f-u)/p,e[1]=(d-l)/p,e[2]=(a-c)/p):o>h&&o>m?(p=Math.sqrt(1+o-h-m)*2,e[3]=(f-u)/p,e[0]=.25*p,e[1]=(a+c)/p,e[2]=(d+l)/p):h>m?(p=Math.sqrt(1+h-o-m)*2,e[3]=(d-l)/p,e[0]=(a+c)/p,e[1]=.25*p,e[2]=(f+u)/p):(p=Math.sqrt(1+m-o-h)*2,e[3]=(a-c)/p,e[0]=(d+l)/p,e[1]=(f+u)/p,e[2]=.25*p),e}function dn(e,t,i,r){t[0]=r[12],t[1]=r[13],t[2]=r[14];let n=r[0],s=r[1],o=r[2],a=r[4],l=r[5],c=r[6],h=r[8],f=r[9],d=r[10];i[0]=Math.sqrt(n*n+s*s+o*o),i[1]=Math.sqrt(a*a+l*l+c*c),i[2]=Math.sqrt(h*h+f*f+d*d);let u=1/i[0],m=1/i[1],g=1/i[2],p=n*u,v=s*m,A=o*g,y=a*u,M=l*m,w=c*g,P=h*u,T=f*m,S=d*g,R=p+M+S,E=0;return R>0?(E=Math.sqrt(R+1)*2,e[3]=.25*E,e[0]=(w-T)/E,e[1]=(P-A)/E,e[2]=(v-y)/E):p>M&&p>S?(E=Math.sqrt(1+p-M-S)*2,e[3]=(w-T)/E,e[0]=.25*E,e[1]=(v+y)/E,e[2]=(P+A)/E):M>S?(E=Math.sqrt(1+M-p-S)*2,e[3]=(P-A)/E,e[0]=(v+y)/E,e[1]=.25*E,e[2]=(w+T)/E):(E=Math.sqrt(1+S-p-M)*2,e[3]=(v-y)/E,e[0]=(P+A)/E,e[1]=(w+T)/E,e[2]=.25*E),e}function xn(e,t,i,r){let n=t[0],s=t[1],o=t[2],a=t[3],l=n+n,c=s+s,h=o+o,f=n*l,d=n*c,u=n*h,m=s*c,g=s*h,p=o*h,v=a*l,A=a*c,y=a*h,M=r[0],w=r[1],P=r[2];return e[0]=(1-(m+p))*M,e[1]=(d+y)*M,e[2]=(u-A)*M,e[3]=0,e[4]=(d-y)*w,e[5]=(1-(f+p))*w,e[6]=(g+v)*w,e[7]=0,e[8]=(u+A)*P,e[9]=(g-v)*P,e[10]=(1-(f+m))*P,e[11]=0,e[12]=i[0],e[13]=i[1],e[14]=i[2],e[15]=1,e}function mn(e,t,i,r,n){let s=t[0],o=t[1],a=t[2],l=t[3],c=s+s,h=o+o,f=a+a,d=s*c,u=s*h,m=s*f,g=o*h,p=o*f,v=a*f,A=l*c,y=l*h,M=l*f,w=r[0],P=r[1],T=r[2],S=n[0],R=n[1],E=n[2],B=(1-(g+v))*w,F=(u+M)*w,V=(m-y)*w,C=(u-M)*P,N=(1-(d+v))*P,Y=(p+A)*P,O=(m+y)*T,K=(p-A)*T,ht=(1-(d+g))*T;return e[0]=B,e[1]=F,e[2]=V,e[3]=0,e[4]=C,e[5]=N,e[6]=Y,e[7]=0,e[8]=O,e[9]=K,e[10]=ht,e[11]=0,e[12]=i[0]+S-(B*S+C*R+O*E),e[13]=i[1]+R-(F*S+N*R+K*E),e[14]=i[2]+E-(V*S+Y*R+ht*E),e[15]=1,e}function pn(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=i+i,a=r+r,l=n+n,c=i*o,h=r*o,f=r*a,d=n*o,u=n*a,m=n*l,g=s*o,p=s*a,v=s*l;return e[0]=1-f-m,e[1]=h+v,e[2]=d-p,e[3]=0,e[4]=h-v,e[5]=1-c-m,e[6]=u+g,e[7]=0,e[8]=d+p,e[9]=u-g,e[10]=1-c-f,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function un(e,t,i,r,n,s,o){let a=1/(i-t),l=1/(n-r),c=1/(s-o);return e[0]=s*2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s*2*l,e[6]=0,e[7]=0,e[8]=(i+t)*a,e[9]=(n+r)*l,e[10]=(o+s)*c,e[11]=-1,e[12]=0,e[13]=0,e[14]=o*s*2*c,e[15]=0,e}function _e(e,t,i,r,n){let s=1/Math.tan(t/2);if(e[0]=s/i,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,n!=null&&n!==1/0){let o=1/(r-n);e[10]=(n+r)*o,e[14]=2*n*r*o}else e[10]=-1,e[14]=-2*r;return e}var gn=_e;function vn(e,t,i,r,n){let s=1/Math.tan(t/2);if(e[0]=s/i,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=s,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,n!=null&&n!==1/0){let o=1/(r-n);e[10]=n*o,e[14]=n*r*o}else e[10]=-1,e[14]=-r;return e}function Mn(e,t,i,r){let n=Math.tan(t.upDegrees*Math.PI/180),s=Math.tan(t.downDegrees*Math.PI/180),o=Math.tan(t.leftDegrees*Math.PI/180),a=Math.tan(t.rightDegrees*Math.PI/180),l=2/(o+a),c=2/(n+s);return e[0]=l,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=c,e[6]=0,e[7]=0,e[8]=-((o-a)*l*.5),e[9]=(n-s)*c*.5,e[10]=r/(i-r),e[11]=-1,e[12]=0,e[13]=0,e[14]=r*i/(i-r),e[15]=0,e}function qe(e,t,i,r,n,s,o){let a=1/(t-i),l=1/(r-n),c=1/(s-o);return e[0]=-2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=2*c,e[11]=0,e[12]=(t+i)*a,e[13]=(n+r)*l,e[14]=(o+s)*c,e[15]=1,e}var yn=qe;function An(e,t,i,r,n,s,o){let a=1/(t-i),l=1/(r-n),c=1/(s-o);return e[0]=-2*a,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=-2*l,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=c,e[11]=0,e[12]=(t+i)*a,e[13]=(n+r)*l,e[14]=s*c,e[15]=1,e}function wn(e,t,i,r){let n,s,o,a,l,c,h,f,d,u,m=t[0],g=t[1],p=t[2],v=r[0],A=r[1],y=r[2],M=i[0],w=i[1],P=i[2];return Math.abs(m-M)<1e-6&&Math.abs(g-w)<1e-6&&Math.abs(p-P)<1e-6?Be(e):(h=m-M,f=g-w,d=p-P,u=1/Math.sqrt(h*h+f*f+d*d),h*=u,f*=u,d*=u,n=A*d-y*f,s=y*h-v*d,o=v*f-A*h,u=Math.sqrt(n*n+s*s+o*o),u?(u=1/u,n*=u,s*=u,o*=u):(n=0,s=0,o=0),a=f*o-d*s,l=d*n-h*o,c=h*s-f*n,u=Math.sqrt(a*a+l*l+c*c),u?(u=1/u,a*=u,l*=u,c*=u):(a=0,l=0,c=0),e[0]=n,e[1]=a,e[2]=h,e[3]=0,e[4]=s,e[5]=l,e[6]=f,e[7]=0,e[8]=o,e[9]=c,e[10]=d,e[11]=0,e[12]=-(n*m+s*g+o*p),e[13]=-(a*m+l*g+c*p),e[14]=-(h*m+f*g+d*p),e[15]=1,e)}function Pn(e,t,i,r){let n=t[0],s=t[1],o=t[2],a=r[0],l=r[1],c=r[2],h=n-i[0],f=s-i[1],d=o-i[2],u=h*h+f*f+d*d;u>0&&(u=1/Math.sqrt(u),h*=u,f*=u,d*=u);let m=l*d-c*f,g=c*h-a*d,p=a*f-l*h;return u=m*m+g*g+p*p,u>0&&(u=1/Math.sqrt(u),m*=u,g*=u,p*=u),e[0]=m,e[1]=g,e[2]=p,e[3]=0,e[4]=f*p-d*g,e[5]=d*m-h*p,e[6]=h*g-f*m,e[7]=0,e[8]=h,e[9]=f,e[10]=d,e[11]=0,e[12]=n,e[13]=s,e[14]=o,e[15]=1,e}function bn(e){return"mat4("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+", "+e[4]+", "+e[5]+", "+e[6]+", "+e[7]+", "+e[8]+", "+e[9]+", "+e[10]+", "+e[11]+", "+e[12]+", "+e[13]+", "+e[14]+", "+e[15]+")"}function Tn(e){return Math.sqrt(e[0]*e[0]+e[1]*e[1]+e[2]*e[2]+e[3]*e[3]+e[4]*e[4]+e[5]*e[5]+e[6]*e[6]+e[7]*e[7]+e[8]*e[8]+e[9]*e[9]+e[10]*e[10]+e[11]*e[11]+e[12]*e[12]+e[13]*e[13]+e[14]*e[14]+e[15]*e[15])}function En(e,t,i){return e[0]=t[0]+i[0],e[1]=t[1]+i[1],e[2]=t[2]+i[2],e[3]=t[3]+i[3],e[4]=t[4]+i[4],e[5]=t[5]+i[5],e[6]=t[6]+i[6],e[7]=t[7]+i[7],e[8]=t[8]+i[8],e[9]=t[9]+i[9],e[10]=t[10]+i[10],e[11]=t[11]+i[11],e[12]=t[12]+i[12],e[13]=t[13]+i[13],e[14]=t[14]+i[14],e[15]=t[15]+i[15],e}function Ye(e,t,i){return e[0]=t[0]-i[0],e[1]=t[1]-i[1],e[2]=t[2]-i[2],e[3]=t[3]-i[3],e[4]=t[4]-i[4],e[5]=t[5]-i[5],e[6]=t[6]-i[6],e[7]=t[7]-i[7],e[8]=t[8]-i[8],e[9]=t[9]-i[9],e[10]=t[10]-i[10],e[11]=t[11]-i[11],e[12]=t[12]-i[12],e[13]=t[13]-i[13],e[14]=t[14]-i[14],e[15]=t[15]-i[15],e}function Rn(e,t,i){return e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e[3]=t[3]*i,e[4]=t[4]*i,e[5]=t[5]*i,e[6]=t[6]*i,e[7]=t[7]*i,e[8]=t[8]*i,e[9]=t[9]*i,e[10]=t[10]*i,e[11]=t[11]*i,e[12]=t[12]*i,e[13]=t[13]*i,e[14]=t[14]*i,e[15]=t[15]*i,e}function Cn(e,t,i,r){return e[0]=t[0]+i[0]*r,e[1]=t[1]+i[1]*r,e[2]=t[2]+i[2]*r,e[3]=t[3]+i[3]*r,e[4]=t[4]+i[4]*r,e[5]=t[5]+i[5]*r,e[6]=t[6]+i[6]*r,e[7]=t[7]+i[7]*r,e[8]=t[8]+i[8]*r,e[9]=t[9]+i[9]*r,e[10]=t[10]+i[10]*r,e[11]=t[11]+i[11]*r,e[12]=t[12]+i[12]*r,e[13]=t[13]+i[13]*r,e[14]=t[14]+i[14]*r,e[15]=t[15]+i[15]*r,e}function zn(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]&&e[4]===t[4]&&e[5]===t[5]&&e[6]===t[6]&&e[7]===t[7]&&e[8]===t[8]&&e[9]===t[9]&&e[10]===t[10]&&e[11]===t[11]&&e[12]===t[12]&&e[13]===t[13]&&e[14]===t[14]&&e[15]===t[15]}function Sn(e,t){let i=e[0],r=e[1],n=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],h=e[8],f=e[9],d=e[10],u=e[11],m=e[12],g=e[13],p=e[14],v=e[15],A=t[0],y=t[1],M=t[2],w=t[3],P=t[4],T=t[5],S=t[6],R=t[7],E=t[8],B=t[9],F=t[10],V=t[11],C=t[12],N=t[13],Y=t[14],O=t[15];return Math.abs(i-A)<=1e-6*Math.max(1,Math.abs(i),Math.abs(A))&&Math.abs(r-y)<=1e-6*Math.max(1,Math.abs(r),Math.abs(y))&&Math.abs(n-M)<=1e-6*Math.max(1,Math.abs(n),Math.abs(M))&&Math.abs(s-w)<=1e-6*Math.max(1,Math.abs(s),Math.abs(w))&&Math.abs(o-P)<=1e-6*Math.max(1,Math.abs(o),Math.abs(P))&&Math.abs(a-T)<=1e-6*Math.max(1,Math.abs(a),Math.abs(T))&&Math.abs(l-S)<=1e-6*Math.max(1,Math.abs(l),Math.abs(S))&&Math.abs(c-R)<=1e-6*Math.max(1,Math.abs(c),Math.abs(R))&&Math.abs(h-E)<=1e-6*Math.max(1,Math.abs(h),Math.abs(E))&&Math.abs(f-B)<=1e-6*Math.max(1,Math.abs(f),Math.abs(B))&&Math.abs(d-F)<=1e-6*Math.max(1,Math.abs(d),Math.abs(F))&&Math.abs(u-V)<=1e-6*Math.max(1,Math.abs(u),Math.abs(V))&&Math.abs(m-C)<=1e-6*Math.max(1,Math.abs(m),Math.abs(C))&&Math.abs(g-N)<=1e-6*Math.max(1,Math.abs(g),Math.abs(N))&&Math.abs(p-Y)<=1e-6*Math.max(1,Math.abs(p),Math.abs(Y))&&Math.abs(v-O)<=1e-6*Math.max(1,Math.abs(v),Math.abs(O))}var Fn=Ve,In=Ye;var b={};_t(b,{add:()=>zs,calculateW:()=>Ms,clone:()=>Es,conjugate:()=>Ps,copy:()=>ui,create:()=>Wt,dot:()=>de,equals:()=>Vs,exactEquals:()=>Bs,exp:()=>xi,fromEuler:()=>bs,fromMat3:()=>pi,fromValues:()=>Rs,getAngle:()=>vs,getAxisAngle:()=>gs,identity:()=>us,invert:()=>ws,len:()=>Is,length:()=>xe,lerp:()=>Fs,ln:()=>mi,mul:()=>Ss,multiply:()=>ci,normalize:()=>pe,pow:()=>ys,random:()=>As,rotateX:()=>hi,rotateY:()=>fi,rotateZ:()=>di,rotationTo:()=>Ls,scale:()=>gi,set:()=>Cs,setAxes:()=>Ns,setAxisAngle:()=>li,slerp:()=>Xt,sqlerp:()=>Us,sqrLen:()=>Ds,squaredLength:()=>me,str:()=>Ts});var x={};_t(x,{add:()=>Ln,angle:()=>rs,bezier:()=>Zn,ceil:()=>Un,clone:()=>Dn,copy:()=>Bn,create:()=>qt,cross:()=>Et,dist:()=>fs,distance:()=>He,div:()=>hs,divide:()=>ke,dot:()=>Tt,equals:()=>as,exactEquals:()=>os,floor:()=>Nn,forEach:()=>ms,fromValues:()=>Yt,hermite:()=>jn,inverse:()=>Gn,len:()=>he,length:()=>Xe,lerp:()=>kn,max:()=>_n,min:()=>On,mul:()=>cs,multiply:()=>Ge,negate:()=>Wn,normalize:()=>ce,random:()=>Kn,rotateX:()=>ts,rotateY:()=>es,rotateZ:()=>is,round:()=>qn,scale:()=>Yn,scaleAndAdd:()=>Xn,set:()=>Vn,slerp:()=>Hn,sqrDist:()=>ds,sqrLen:()=>xs,squaredDistance:()=>je,squaredLength:()=>Ze,str:()=>ss,sub:()=>ls,subtract:()=>We,transformMat3:()=>Jn,transformMat4:()=>Qn,transformQuat:()=>$n,zero:()=>ns});function qt(){let e=new L(3);return L!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function Dn(e){var t=new L(3);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t}function Xe(e){let t=e[0],i=e[1],r=e[2];return Math.sqrt(t*t+i*i+r*r)}function Yt(e,t,i){let r=new L(3);return r[0]=e,r[1]=t,r[2]=i,r}function Bn(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function Vn(e,t,i,r){return e[0]=t,e[1]=i,e[2]=r,e}function Ln(e,t,i){return e[0]=t[0]+i[0],e[1]=t[1]+i[1],e[2]=t[2]+i[2],e}function We(e,t,i){return e[0]=t[0]-i[0],e[1]=t[1]-i[1],e[2]=t[2]-i[2],e}function Ge(e,t,i){return e[0]=t[0]*i[0],e[1]=t[1]*i[1],e[2]=t[2]*i[2],e}function ke(e,t,i){return e[0]=t[0]/i[0],e[1]=t[1]/i[1],e[2]=t[2]/i[2],e}function Un(e,t){return e[0]=Math.ceil(t[0]),e[1]=Math.ceil(t[1]),e[2]=Math.ceil(t[2]),e}function Nn(e,t){return e[0]=Math.floor(t[0]),e[1]=Math.floor(t[1]),e[2]=Math.floor(t[2]),e}function On(e,t,i){return e[0]=Math.min(t[0],i[0]),e[1]=Math.min(t[1],i[1]),e[2]=Math.min(t[2],i[2]),e}function _n(e,t,i){return e[0]=Math.max(t[0],i[0]),e[1]=Math.max(t[1],i[1]),e[2]=Math.max(t[2],i[2]),e}function qn(e,t){return e[0]=ut(t[0]),e[1]=ut(t[1]),e[2]=ut(t[2]),e}function Yn(e,t,i){return e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e}function Xn(e,t,i,r){return e[0]=t[0]+i[0]*r,e[1]=t[1]+i[1]*r,e[2]=t[2]+i[2]*r,e}function He(e,t){let i=t[0]-e[0],r=t[1]-e[1],n=t[2]-e[2];return Math.sqrt(i*i+r*r+n*n)}function je(e,t){let i=t[0]-e[0],r=t[1]-e[1],n=t[2]-e[2];return i*i+r*r+n*n}function Ze(e){let t=e[0],i=e[1],r=e[2];return t*t+i*i+r*r}function Wn(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e}function Gn(e,t){return e[0]=1/t[0],e[1]=1/t[1],e[2]=1/t[2],e}function ce(e,t){let i=t[0],r=t[1],n=t[2],s=i*i+r*r+n*n;return s>0&&(s=1/Math.sqrt(s)),e[0]=t[0]*s,e[1]=t[1]*s,e[2]=t[2]*s,e}function Tt(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function Et(e,t,i){let r=t[0],n=t[1],s=t[2],o=i[0],a=i[1],l=i[2];return e[0]=n*l-s*a,e[1]=s*o-r*l,e[2]=r*a-n*o,e}function kn(e,t,i,r){let n=t[0],s=t[1],o=t[2];return e[0]=n+r*(i[0]-n),e[1]=s+r*(i[1]-s),e[2]=o+r*(i[2]-o),e}function Hn(e,t,i,r){let n=Math.acos(Math.min(Math.max(Tt(t,i),-1),1)),s=Math.sin(n),o=Math.sin((1-r)*n)/s,a=Math.sin(r*n)/s;return e[0]=o*t[0]+a*i[0],e[1]=o*t[1]+a*i[1],e[2]=o*t[2]+a*i[2],e}function jn(e,t,i,r,n,s){let o=s*s,a=o*(2*s-3)+1,l=o*(s-2)+s,c=o*(s-1),h=o*(3-2*s);return e[0]=t[0]*a+i[0]*l+r[0]*c+n[0]*h,e[1]=t[1]*a+i[1]*l+r[1]*c+n[1]*h,e[2]=t[2]*a+i[2]*l+r[2]*c+n[2]*h,e}function Zn(e,t,i,r,n,s){let o=1-s,a=o*o,l=s*s,c=a*o,h=3*s*a,f=3*l*o,d=l*s;return e[0]=t[0]*c+i[0]*h+r[0]*f+n[0]*d,e[1]=t[1]*c+i[1]*h+r[1]*f+n[1]*d,e[2]=t[2]*c+i[2]*h+r[2]*f+n[2]*d,e}function Kn(e,t){t=t===void 0?1:t;let i=tt()*2*Math.PI,r=tt()*2-1,n=Math.sqrt(1-r*r)*t;return e[0]=Math.cos(i)*n,e[1]=Math.sin(i)*n,e[2]=r*t,e}function Qn(e,t,i){let r=t[0],n=t[1],s=t[2],o=i[3]*r+i[7]*n+i[11]*s+i[15];return o=o||1,e[0]=(i[0]*r+i[4]*n+i[8]*s+i[12])/o,e[1]=(i[1]*r+i[5]*n+i[9]*s+i[13])/o,e[2]=(i[2]*r+i[6]*n+i[10]*s+i[14])/o,e}function Jn(e,t,i){let r=t[0],n=t[1],s=t[2];return e[0]=r*i[0]+n*i[3]+s*i[6],e[1]=r*i[1]+n*i[4]+s*i[7],e[2]=r*i[2]+n*i[5]+s*i[8],e}function $n(e,t,i){let r=i[0],n=i[1],s=i[2],o=i[3],a=t[0],l=t[1],c=t[2],h=n*c-s*l,f=s*a-r*c,d=r*l-n*a,u=n*d-s*f,m=s*h-r*d,g=r*f-n*h,p=o*2;return h*=p,f*=p,d*=p,u*=2,m*=2,g*=2,e[0]=a+h+u,e[1]=l+f+m,e[2]=c+d+g,e}function ts(e,t,i,r){let n=[],s=[];return n[0]=t[0]-i[0],n[1]=t[1]-i[1],n[2]=t[2]-i[2],s[0]=n[0],s[1]=n[1]*Math.cos(r)-n[2]*Math.sin(r),s[2]=n[1]*Math.sin(r)+n[2]*Math.cos(r),e[0]=s[0]+i[0],e[1]=s[1]+i[1],e[2]=s[2]+i[2],e}function es(e,t,i,r){let n=[],s=[];return n[0]=t[0]-i[0],n[1]=t[1]-i[1],n[2]=t[2]-i[2],s[0]=n[2]*Math.sin(r)+n[0]*Math.cos(r),s[1]=n[1],s[2]=n[2]*Math.cos(r)-n[0]*Math.sin(r),e[0]=s[0]+i[0],e[1]=s[1]+i[1],e[2]=s[2]+i[2],e}function is(e,t,i,r){let n=[],s=[];return n[0]=t[0]-i[0],n[1]=t[1]-i[1],n[2]=t[2]-i[2],s[0]=n[0]*Math.cos(r)-n[1]*Math.sin(r),s[1]=n[0]*Math.sin(r)+n[1]*Math.cos(r),s[2]=n[2],e[0]=s[0]+i[0],e[1]=s[1]+i[1],e[2]=s[2]+i[2],e}function rs(e,t){let i=e[0],r=e[1],n=e[2],s=t[0],o=t[1],a=t[2],l=Math.sqrt((i*i+r*r+n*n)*(s*s+o*o+a*a)),c=l&&Tt(e,t)/l;return Math.acos(Math.min(Math.max(c,-1),1))}function ns(e){return e[0]=0,e[1]=0,e[2]=0,e}function ss(e){return"vec3("+e[0]+", "+e[1]+", "+e[2]+")"}function os(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]}function as(e,t){let i=e[0],r=e[1],n=e[2],s=t[0],o=t[1],a=t[2];return Math.abs(i-s)<=1e-6*Math.max(1,Math.abs(i),Math.abs(s))&&Math.abs(r-o)<=1e-6*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(n-a)<=1e-6*Math.max(1,Math.abs(n),Math.abs(a))}var ls=We,cs=Ge,hs=ke,fs=He,ds=je,he=Xe,xs=Ze,ms=(function(){let e=qt();return function(t,i,r,n,s,o){let a,l;for(i||(i=3),r||(r=0),n?l=Math.min(n*i+r,t.length):l=t.length,a=r;a<l;a+=i)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],s(e,e,o),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2];return t}})();function ps(){let e=new L(4);return L!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Ke(e){let t=new L(4);return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t}function Qe(e,t,i,r){let n=new L(4);return n[0]=e,n[1]=t,n[2]=i,n[3]=r,n}function Je(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e}function $e(e,t,i,r,n){return e[0]=t,e[1]=i,e[2]=r,e[3]=n,e}function ti(e,t,i){return e[0]=t[0]+i[0],e[1]=t[1]+i[1],e[2]=t[2]+i[2],e[3]=t[3]+i[3],e}function ei(e,t,i){return e[0]=t[0]*i,e[1]=t[1]*i,e[2]=t[2]*i,e[3]=t[3]*i,e}function ii(e){let t=e[0],i=e[1],r=e[2],n=e[3];return Math.sqrt(t*t+i*i+r*r+n*n)}function ri(e){let t=e[0],i=e[1],r=e[2],n=e[3];return t*t+i*i+r*r+n*n}function ni(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=i*i+r*r+n*n+s*s;return o>0&&(o=1/Math.sqrt(o)),e[0]=i*o,e[1]=r*o,e[2]=n*o,e[3]=s*o,e}function fe(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]+e[3]*t[3]}function si(e,t,i,r){let n=t[0],s=t[1],o=t[2],a=t[3];return e[0]=n+r*(i[0]-n),e[1]=s+r*(i[1]-s),e[2]=o+r*(i[2]-o),e[3]=a+r*(i[3]-a),e}function oi(e,t){return e[0]===t[0]&&e[1]===t[1]&&e[2]===t[2]&&e[3]===t[3]}var Qo=(function(){let e=ps();return function(t,i,r,n,s,o){let a,l;for(i||(i=4),r||(r=0),n?l=Math.min(n*i+r,t.length):l=t.length,a=r;a<l;a+=i)e[0]=t[a],e[1]=t[a+1],e[2]=t[a+2],e[3]=t[a+3],s(e,e,o),t[a]=e[0],t[a+1]=e[1],t[a+2]=e[2],t[a+3]=e[3];return t}})();function Wt(){let e=new L(4);return L!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function us(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}function li(e,t,i){i=i*.5;let r=Math.sin(i);return e[0]=r*t[0],e[1]=r*t[1],e[2]=r*t[2],e[3]=Math.cos(i),e}function gs(e,t){let i=Math.acos(t[3])*2,r=Math.sin(i/2);return r>1e-6?(e[0]=t[0]/r,e[1]=t[1]/r,e[2]=t[2]/r):(e[0]=1,e[1]=0,e[2]=0),i}function vs(e,t){let i=de(e,t);return Math.acos(2*i*i-1)}function ci(e,t,i){let r=t[0],n=t[1],s=t[2],o=t[3],a=i[0],l=i[1],c=i[2],h=i[3];return e[0]=r*h+o*a+n*c-s*l,e[1]=n*h+o*l+s*a-r*c,e[2]=s*h+o*c+r*l-n*a,e[3]=o*h-r*a-n*l-s*c,e}function hi(e,t,i){i*=.5;let r=t[0],n=t[1],s=t[2],o=t[3],a=Math.sin(i),l=Math.cos(i);return e[0]=r*l+o*a,e[1]=n*l+s*a,e[2]=s*l-n*a,e[3]=o*l-r*a,e}function fi(e,t,i){i*=.5;let r=t[0],n=t[1],s=t[2],o=t[3],a=Math.sin(i),l=Math.cos(i);return e[0]=r*l-s*a,e[1]=n*l+o*a,e[2]=s*l+r*a,e[3]=o*l-n*a,e}function di(e,t,i){i*=.5;let r=t[0],n=t[1],s=t[2],o=t[3],a=Math.sin(i),l=Math.cos(i);return e[0]=r*l+n*a,e[1]=n*l-r*a,e[2]=s*l+o*a,e[3]=o*l-s*a,e}function Ms(e,t){let i=t[0],r=t[1],n=t[2];return e[0]=i,e[1]=r,e[2]=n,e[3]=Math.sqrt(Math.abs(1-i*i-r*r-n*n)),e}function xi(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=Math.sqrt(i*i+r*r+n*n),a=Math.exp(s),l=o>0?a*Math.sin(o)/o:0;return e[0]=i*l,e[1]=r*l,e[2]=n*l,e[3]=a*Math.cos(o),e}function mi(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=Math.sqrt(i*i+r*r+n*n),a=o>0?Math.atan2(o,s)/o:0;return e[0]=i*a,e[1]=r*a,e[2]=n*a,e[3]=.5*Math.log(i*i+r*r+n*n+s*s),e}function ys(e,t,i){return mi(e,t),gi(e,e,i),xi(e,e),e}function Xt(e,t,i,r){let n=t[0],s=t[1],o=t[2],a=t[3],l=i[0],c=i[1],h=i[2],f=i[3],d,u,m,g,p;return u=n*l+s*c+o*h+a*f,u<0&&(u=-u,l=-l,c=-c,h=-h,f=-f),1-u>1e-6?(d=Math.acos(u),m=Math.sin(d),g=Math.sin((1-r)*d)/m,p=Math.sin(r*d)/m):(g=1-r,p=r),e[0]=g*n+p*l,e[1]=g*s+p*c,e[2]=g*o+p*h,e[3]=g*a+p*f,e}function As(e){let t=tt(),i=tt(),r=tt(),n=Math.sqrt(1-t),s=Math.sqrt(t);return e[0]=n*Math.sin(2*Math.PI*i),e[1]=n*Math.cos(2*Math.PI*i),e[2]=s*Math.sin(2*Math.PI*r),e[3]=s*Math.cos(2*Math.PI*r),e}function ws(e,t){let i=t[0],r=t[1],n=t[2],s=t[3],o=i*i+r*r+n*n+s*s,a=o?1/o:0;return e[0]=-i*a,e[1]=-r*a,e[2]=-n*a,e[3]=s*a,e}function Ps(e,t){return e[0]=-t[0],e[1]=-t[1],e[2]=-t[2],e[3]=t[3],e}function pi(e,t){let i=t[0]+t[4]+t[8],r;if(i>0)r=Math.sqrt(i+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{let n=0;t[4]>t[0]&&(n=1),t[8]>t[n*3+n]&&(n=2);let s=(n+1)%3,o=(n+2)%3;r=Math.sqrt(t[n*3+n]-t[s*3+s]-t[o*3+o]+1),e[n]=.5*r,r=.5/r,e[3]=(t[s*3+o]-t[o*3+s])*r,e[s]=(t[s*3+n]+t[n*3+s])*r,e[o]=(t[o*3+n]+t[n*3+o])*r}return e}function bs(e,t,i,r,n=Fe){let s=Math.PI/360;t*=s,r*=s,i*=s;let o=Math.sin(t),a=Math.cos(t),l=Math.sin(i),c=Math.cos(i),h=Math.sin(r),f=Math.cos(r);switch(n){case"xyz":e[0]=o*c*f+a*l*h,e[1]=a*l*f-o*c*h,e[2]=a*c*h+o*l*f,e[3]=a*c*f-o*l*h;break;case"xzy":e[0]=o*c*f-a*l*h,e[1]=a*l*f-o*c*h,e[2]=a*c*h+o*l*f,e[3]=a*c*f+o*l*h;break;case"yxz":e[0]=o*c*f+a*l*h,e[1]=a*l*f-o*c*h,e[2]=a*c*h-o*l*f,e[3]=a*c*f+o*l*h;break;case"yzx":e[0]=o*c*f+a*l*h,e[1]=a*l*f+o*c*h,e[2]=a*c*h-o*l*f,e[3]=a*c*f-o*l*h;break;case"zxy":e[0]=o*c*f-a*l*h,e[1]=a*l*f+o*c*h,e[2]=a*c*h+o*l*f,e[3]=a*c*f-o*l*h;break;case"zyx":e[0]=o*c*f-a*l*h,e[1]=a*l*f+o*c*h,e[2]=a*c*h-o*l*f,e[3]=a*c*f+o*l*h;break;default:throw new Error("Unknown angle order "+n)}return e}function Ts(e){return"quat("+e[0]+", "+e[1]+", "+e[2]+", "+e[3]+")"}var Es=Ke,Rs=Qe,ui=Je,Cs=$e,zs=ti,Ss=ci,gi=ei,de=fe,Fs=si,xe=ii,Is=xe,me=ri,Ds=me,pe=ni,Bs=oi;function Vs(e,t){return Math.abs(fe(e,t))>=1-1e-6}var Ls=(function(){let e=qt(),t=Yt(1,0,0),i=Yt(0,1,0);return function(r,n,s){let o=Tt(n,s);return o<-.999999?(Et(e,t,n),he(e)<1e-6&&Et(e,i,n),ce(e,e),li(r,e,Math.PI),r):o>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(Et(e,n,s),r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=1+o,pe(r,r))}})(),Us=(function(){let e=Wt(),t=Wt();return function(i,r,n,s,o,a){return Xt(e,r,o,a),Xt(t,n,s,a),Xt(i,e,t,2*a*(1-a)),i}})(),Ns=(function(){let e=le();return function(t,i,r,n){return e[0]=r[0],e[3]=r[1],e[6]=r[2],e[1]=n[0],e[4]=n[1],e[7]=n[2],e[2]=-i[0],e[5]=-i[1],e[8]=-i[2],pe(t,pi(t,e))}})();function _s(){let e=new L(2);return L!=Float32Array&&(e[0]=0,e[1]=0),e}var Jo=(function(){let e=_s();return function(t,i,r,n,s,o){let a,l;for(i||(i=2),r||(r=0),n?l=Math.min(n*i+r,t.length):l=t.length,a=r;a<l;a+=i)e[0]=t[a],e[1]=t[a+1],s(e,e,o),t[a]=e[0],t[a+1]=e[1];return t}})();var Rt=class{constructor(t,i){this.targetFPS=t,this.now,this.then=Date.now(),this.interval=1e3/this.targetFPS,this.delta,this.totalFrames=i,this.frameStep=0,this.loopTime=0,this.totalTime=0,this.cycle=0,this.frames=0,this.ptime=0,this.fps=0}calcFPS(t){return this.frames++,t>=this.ptime+1e3&&(this.fps=this.frames*1e3/(t-this.ptime),this.ptime=t,this.frames=0),this.fps}stepTime(t){this.now=Date.now(),this.delta=this.now-this.then,this.totalTime++}updateTime(t){this.then=this.now-this.delta%this.interval,this.frameStep>this.totalFrames-1&&(this.frameStep=0,this.cycle+=1),this.loopTime=this.frameStep/this.totalFrames*(Math.PI*2)}};var Ys={signature:"GIF",version:"89a",trailer:59,extensionIntroducer:33,applicationExtensionLabel:255,graphicControlExtensionLabel:249,imageSeparator:44,signatureSize:3,versionSize:3,globalColorTableFlagMask:128,colorResolutionMask:112,sortFlagMask:8,globalColorTableSizeMask:7,applicationIdentifierSize:8,applicationAuthCodeSize:3,disposalMethodMask:28,userInputFlagMask:2,transparentColorFlagMask:1,localColorTableFlagMask:128,interlaceFlagMask:64,idSortFlagMask:32,localColorTableSizeMask:7};function Ai(e=256){let t=0,i=new Uint8Array(e);return{get buffer(){return i.buffer},reset(){t=0},bytesView(){return i.subarray(0,t)},bytes(){return i.slice(0,t)},writeByte(n){r(t+1),i[t]=n,t++},writeBytes(n,s=0,o=n.length){r(t+o);for(let a=0;a<o;a++)i[t++]=n[a+s]},writeBytesView(n,s=0,o=n.byteLength){r(t+o),i.set(n.subarray(s,s+o),t),t+=o}};function r(n){var s=i.length;if(s>=n)return;var o=1024*1024;n=Math.max(n,s*(s<o?2:1.125)>>>0),s!=0&&(n=Math.max(n,256));let a=i;i=new Uint8Array(n),t>0&&i.set(a.subarray(0,t),0)}}var ue=12,vi=5003,Xs=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function Ws(e,t,i,r,n=Ai(512),s=new Uint8Array(256),o=new Int32Array(vi),a=new Int32Array(vi)){let l=o.length,c=Math.max(2,r);s.fill(0),a.fill(0),o.fill(-1);let h=0,f=0,d=c+1,u=d,m=!1,g=u,p=(1<<g)-1,v=1<<d-1,A=v+1,y=v+2,M=0,w=i[0],P=0;for(let R=l;R<65536;R*=2)++P;P=8-P,n.writeByte(c),S(v);let T=i.length;for(let R=1;R<T;R++)t:{let E=i[R],B=(E<<ue)+w,F=E<<P^w;if(o[F]===B){w=a[F];break t}let V=F===0?1:l-F;for(;o[F]>=0;)if(F-=V,F<0&&(F+=l),o[F]===B){w=a[F];break t}S(w),w=E,y<1<<ue?(a[F]=y++,o[F]=B):(o.fill(-1),y=v+2,m=!0,S(v))}return S(w),S(A),n.writeByte(0),n.bytesView();function S(R){for(h&=Xs[f],f>0?h|=R<<f:h=R,f+=g;f>=8;)s[M++]=h&255,M>=254&&(n.writeByte(M),n.writeBytesView(s,0,M),M=0),h>>=8,f-=8;if((y>p||m)&&(m?(g=u,p=(1<<g)-1,m=!1):(++g,p=g===ue?1<<g:(1<<g)-1)),R==A){for(;f>0;)s[M++]=h&255,M>=254&&(n.writeByte(M),n.writeBytesView(s,0,M),M=0),h>>=8,f-=8;M>0&&(n.writeByte(M),n.writeBytesView(s,0,M),M=0)}}}var Gs=Ws;function wi(e,t,i){return e<<8&63488|t<<2&992|i>>3}function Pi(e,t,i,r){return e>>4|t&240|(i&240)<<4|(r&240)<<8}function bi(e,t,i){return e>>4<<8|t&240|i>>4}function Gt(e,t,i){return e<t?t:e>i?i:e}function Ct(e){return e*e}function Mi(e,t,i){var r=0,n=1e100;let s=e[t],o=s.cnt,a=s.ac,l=s.rc,c=s.gc,h=s.bc;for(var f=s.fw;f!=0;f=e[f].fw){let u=e[f],m=u.cnt,g=o*m/(o+m);if(!(g>=n)){var d=0;i&&(d+=g*Ct(u.ac-a),d>=n)||(d+=g*Ct(u.rc-l),!(d>=n)&&(d+=g*Ct(u.gc-c),!(d>=n)&&(d+=g*Ct(u.bc-h),!(d>=n)&&(n=d,r=f))))}}s.err=n,s.nn=r}function ge(){return{ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0}}function ks(e,t){let i=t==="rgb444"?4096:65536,r=new Array(i),n=e.length;if(t==="rgba4444")for(let s=0;s<n;++s){let o=e[s],a=o>>24&255,l=o>>16&255,c=o>>8&255,h=o&255,f=Pi(h,c,l,a),d=f in r?r[f]:r[f]=ge();d.rc+=h,d.gc+=c,d.bc+=l,d.ac+=a,d.cnt++}else if(t==="rgb444")for(let s=0;s<n;++s){let o=e[s],a=o>>16&255,l=o>>8&255,c=o&255,h=bi(c,l,a),f=h in r?r[h]:r[h]=ge();f.rc+=c,f.gc+=l,f.bc+=a,f.cnt++}else for(let s=0;s<n;++s){let o=e[s],a=o>>16&255,l=o>>8&255,c=o&255,h=wi(c,l,a),f=h in r?r[h]:r[h]=ge();f.rc+=c,f.gc+=l,f.bc+=a,f.cnt++}return r}function Ti(e,t,i={}){let{format:r="rgb565",clearAlpha:n=!0,clearAlphaColor:s=0,clearAlphaThreshold:o=0,oneBitAlpha:a=!1}=i;if(!e||!e.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(e instanceof Uint8Array)&&!(e instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");let l=new Uint32Array(e.buffer),c=i.useSqrt!==!1,h=r==="rgba4444",f=ks(l,r),d=f.length,u=d-1,m=new Uint32Array(d+1);for(var g=0,p=0;p<d;++p){let C=f[p];if(C!=null){var v=1/C.cnt;h&&(C.ac*=v),C.rc*=v,C.gc*=v,C.bc*=v,f[g++]=C}}Ct(t)/g<.022&&(c=!1);for(var p=0;p<g-1;++p)f[p].fw=p+1,f[p+1].bk=p,c&&(f[p].cnt=Math.sqrt(f[p].cnt));c&&(f[p].cnt=Math.sqrt(f[p].cnt));var A,y,M;for(p=0;p<g;++p){Mi(f,p,!1);var w=f[p].err;for(y=++m[0];y>1&&(M=y>>1,!(f[A=m[M]].err<=w));y=M)m[y]=A;m[y]=p}var P=g-t;for(p=0;p<P;){for(var T;;){var S=m[1];if(T=f[S],T.tm>=T.mtm&&f[T.nn].mtm<=T.tm)break;T.mtm==u?S=m[1]=m[m[0]--]:(Mi(f,S,!1),T.tm=p);var w=f[S].err;for(y=1;(M=y+y)<=m[0]&&(M<m[0]&&f[m[M]].err>f[m[M+1]].err&&M++,!(w<=f[A=m[M]].err));y=M)m[y]=A;m[y]=S}var R=f[T.nn],E=T.cnt,B=R.cnt,v=1/(E+B);h&&(T.ac=v*(E*T.ac+B*R.ac)),T.rc=v*(E*T.rc+B*R.rc),T.gc=v*(E*T.gc+B*R.gc),T.bc=v*(E*T.bc+B*R.bc),T.cnt+=R.cnt,T.mtm=++p,f[R.bk].fw=R.fw,f[R.fw].bk=R.bk,R.mtm=u}let F=[];var V=0;for(p=0;;++V){let C=Gt(Math.round(f[p].rc),0,255),N=Gt(Math.round(f[p].gc),0,255),Y=Gt(Math.round(f[p].bc),0,255),O=255;h&&(O=Gt(Math.round(f[p].ac),0,255),a&&(O=O<=(typeof a=="number"?a:127)?0:255),n&&O<=o&&(C=N=Y=s,O=0));let K=h?[C,N,Y,O]:[C,N,Y];if(Hs(F,K)||F.push(K),(p=f[p].fw)==0)break}return F}function Hs(e,t){for(let i=0;i<e.length;i++){let r=e[i],n=r[0]===t[0]&&r[1]===t[1]&&r[2]===t[2],s=r.length>=4&&t.length>=4?r[3]===t[3]:!0;if(n&&s)return!0}return!1}function Ei(e,t,i="rgb565"){if(!e||!e.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(e instanceof Uint8Array)&&!(e instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");if(t.length>256)throw new Error("applyPalette() only works with 256 colors or less");let r=new Uint32Array(e.buffer),n=r.length,s=i==="rgb444"?4096:65536,o=new Uint8Array(n),a=new Array(s),l=i==="rgba4444";if(i==="rgba4444")for(let c=0;c<n;c++){let h=r[c],f=h>>24&255,d=h>>16&255,u=h>>8&255,m=h&255,g=Pi(m,u,d,f),p=g in a?a[g]:a[g]=js(m,u,d,f,t);o[c]=p}else{let c=i==="rgb444"?bi:wi;for(let h=0;h<n;h++){let f=r[h],d=f>>16&255,u=f>>8&255,m=f&255,g=c(m,u,d),p=g in a?a[g]:a[g]=Zs(m,u,d,t);o[h]=p}}return o}function js(e,t,i,r,n){let s=0,o=1e100;for(let a=0;a<n.length;a++){let l=n[a],c=l[3],h=ft(c-r);if(h>o)continue;let f=l[0];if(h+=ft(f-e),h>o)continue;let d=l[1];if(h+=ft(d-t),h>o)continue;let u=l[2];h+=ft(u-i),!(h>o)&&(o=h,s=a)}return s}function Zs(e,t,i,r){let n=0,s=1e100;for(let o=0;o<r.length;o++){let a=r[o],l=a[0],c=ft(l-e);if(c>s)continue;let h=a[1];if(c+=ft(h-t),c>s)continue;let f=a[2];c+=ft(f-i),!(c>s)&&(s=c,n=o)}return n}function ft(e){return e*e}function Ri(e={}){let{initialCapacity:t=4096,auto:i=!0}=e,r=Ai(t),n=5003,s=new Uint8Array(256),o=new Int32Array(n),a=new Int32Array(n),l=!1;return{reset(){r.reset(),l=!1},finish(){r.writeByte(Ys.trailer)},bytes(){return r.bytes()},bytesView(){return r.bytesView()},get buffer(){return r.buffer},get stream(){return r},writeHeader:c,writeFrame(h,f,d,u={}){let{transparent:m=!1,transparentIndex:g=0,delay:p=0,palette:v=null,repeat:A=0,colorDepth:y=8,dispose:M=-1}=u,w=!1;if(i?l||(w=!0,c(),l=!0):w=!!u.first,f=Math.max(0,Math.floor(f)),d=Math.max(0,Math.floor(d)),w){if(!v)throw new Error("First frame must include a { palette } option");Qs(r,f,d,v,y),yi(r,v),A>=0&&Js(r,A)}let P=Math.round(p/10);Ks(r,M,P,m,g);let T=!!v&&!w;$s(r,f,d,T?v:null),T&&yi(r,v),to(r,h,f,d,y,s,o,a)}};function c(){Ci(r,"GIF89a")}}function Ks(e,t,i,r,n){e.writeByte(33),e.writeByte(249),e.writeByte(4),n<0&&(n=0,r=!1);var s,o;r?(s=1,o=2):(s=0,o=0),t>=0&&(o=t&7),o<<=2,e.writeByte(0|o|0|s),rt(e,i),e.writeByte(n||0),e.writeByte(0)}function Qs(e,t,i,r,n=8){let s=1,o=0,a=ve(r.length)-1,l=s<<7|n-1<<4|o<<3|a;rt(e,t),rt(e,i),e.writeBytes([l,0,0])}function Js(e,t){e.writeByte(33),e.writeByte(255),e.writeByte(11),Ci(e,"NETSCAPE2.0"),e.writeByte(3),e.writeByte(1),rt(e,t),e.writeByte(0)}function yi(e,t){let i=1<<ve(t.length);for(let r=0;r<i;r++){let n=[0,0,0];r<t.length&&(n=t[r]),e.writeByte(n[0]),e.writeByte(n[1]),e.writeByte(n[2])}}function $s(e,t,i,r){if(e.writeByte(44),rt(e,0),rt(e,0),rt(e,t),rt(e,i),r){let n=0,s=0,o=ve(r.length)-1;e.writeByte(128|n|s|0|o)}else e.writeByte(0)}function to(e,t,i,r,n=8,s,o,a){Gs(i,r,t,n,e,s,o,a)}function rt(e,t){e.writeByte(t&255),e.writeByte(t>>8&255)}function Ci(e,t){for(var i=0;i<t.length;i++)e.writeByte(t.charCodeAt(i))}function ve(e){return Math.max(Math.ceil(Math.log2(e)),1)}function zi(e){let t=document.createElement("canvas"),i=t.getContext("2d");return t.width=e.width,t.height=e.height,i.drawImage(e,0,0),t}function Si(e,t,i){return e+(t-e)*i}function Fi(e,t){let i=e.length,r,n,s=function(){let o=Math.sin(t++)*1e4;return o-Math.floor(o)};for(;i;)n=Math.floor(s()*i--),r=e[i],e[i]=e[n],e[n]=r;return e}var dt=class{constructor(t,i,r){this.gl=t,this.program=null,this.uniforms=new Map,this.textureUnits=new Map,this.nextTextureUnit=0,this.init(i,r)}init(t,i){let r=this.compileShader(t,this.gl.VERTEX_SHADER),n=this.compileShader(i,this.gl.FRAGMENT_SHADER);if(this.program=this.gl.createProgram(),this.gl.attachShader(this.program,r),this.gl.attachShader(this.program,n),this.gl.linkProgram(this.program),!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS))throw new Error(`Program link error: ${this.gl.getProgramInfoLog(this.program)}`);this.gl.detachShader(this.program,r),this.gl.detachShader(this.program,n),this.gl.deleteShader(r),this.gl.deleteShader(n)}cacheUniformLocations(){let t=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_UNIFORMS);for(let i=0;i<t;i++){let r=this.gl.getActiveUniform(this.program,i);if(!r)continue;let n=this.gl.getUniformLocation(this.program,r.name);this.uniforms.set(r.name,{location:n,type:r.type,size:r.size,value:null}),(r.type===this.gl.SAMPLER_2D||r.type===this.gl.SAMPLER_CUBE)&&this.textureUnits.set(r.name,this.nextTextureUnit++)}}setUniform(t,i){if(this.use(),!this.uniforms.has(t)){let n=this.gl.getUniformLocation(this.program,t);if(n===null)return;let s;if(i instanceof Float32Array)i.length===2?s=this.gl.FLOAT_VEC2:i.length===3?s=this.gl.FLOAT_VEC3:i.length===4?s=this.gl.FLOAT_VEC4:i.length===16?s=this.gl.FLOAT_MAT4:i.length===9?s=this.gl.FLOAT_MAT3:s=this.gl.FLOAT;else if(Array.isArray(i))i.length===2?s=this.gl.FLOAT_VEC2:i.length===3?s=this.gl.FLOAT_VEC3:i.length===4?s=this.gl.FLOAT_VEC4:i.length===30?s=this.gl.FLOAT_VEC3:s=this.gl.FLOAT;else if(typeof i=="number")s=this.gl.FLOAT;else if(typeof i=="boolean"||typeof i=="number"&&Number.isInteger(i))s=this.gl.INT;else{console.warn(`Unknown type for uniform '${t}'`);return}this.uniforms.set(t,{location:n,type:s,size:1,value:null})}let r=this.uniforms.get(t);this._valuesEqual(r.value,i)||(r.value=this._cloneValue(i),this._setUniformValue(r.location,r.type,i))}setUniforms(t){this.use();for(let[i,r]of Object.entries(t))this.setUniform(i,r)}setTextures(t){this.use();let i=t instanceof Map?t.entries():Object.entries(t);for(let[r,n]of i){this.textureUnits.has(r)||this.textureUnits.set(r,this.nextTextureUnit++);let s=this.textureUnits.get(r),o=this.gl.getUniformLocation(this.program,r);o&&(this.gl.uniform1i(o,s),this.gl.activeTexture(this.gl.TEXTURE0+s),this.gl.bindTexture(this.gl.TEXTURE_2D,n),this.uniforms.set(r,{location:o,type:this.gl.SAMPLER_2D,size:1,value:n}))}}setTexture(t,i,r=null,n=null){this.use(),r===null&&(this.textureUnits.has(t)||this.textureUnits.set(t,this.nextTextureUnit++),r=this.textureUnits.get(t));let s=this.gl.getUniformLocation(this.program,t);if(s===null)return;let o=n||this.gl.TEXTURE_2D;this.gl.uniform1i(s,r),this.gl.activeTexture(this.gl.TEXTURE0+r),this.gl.bindTexture(o,i),this.uniforms.set(t,{location:s,type:o===this.gl.TEXTURE_2D?this.gl.SAMPLER_2D:this.gl.SAMPLER_CUBE,size:1,value:i})}_setUniformValue(t,i,r){let n=this.gl;switch(i){case n.FLOAT:n.uniform1f(t,r);break;case n.FLOAT_VEC2:n.uniform2fv(t,r);break;case n.FLOAT_VEC3:n.uniform3fv(t,r);break;case n.FLOAT_VEC4:n.uniform4fv(t,r);break;case n.INT:case n.BOOL:n.uniform1i(t,r);break;case n.INT_VEC2:case n.BOOL_VEC2:n.uniform2iv(t,r);break;case n.INT_VEC3:case n.BOOL_VEC3:n.uniform3iv(t,r);break;case n.INT_VEC4:case n.BOOL_VEC4:n.uniform4iv(t,r);break;case n.FLOAT_MAT2:n.uniformMatrix2fv(t,!1,r);break;case n.FLOAT_MAT3:n.uniformMatrix3fv(t,!1,r);break;case n.FLOAT_MAT4:n.uniformMatrix4fv(t,!1,r);break;case n.SAMPLER_2D:case n.SAMPLER_CUBE:break;default:console.warn(`Unhandled uniform type: ${i}`)}}_valuesEqual(t,i){if(t===i)return!0;if(t===null||i===null)return!1;if((Array.isArray(t)||ArrayBuffer.isView(t))&&(Array.isArray(i)||ArrayBuffer.isView(i))){if(t.length!==i.length)return!1;for(let r=0;r<t.length;r++)if(t[r]!==i[r])return!1;return!0}return!1}_cloneValue(t){return t===null?null:typeof t!="object"?t:Array.isArray(t)?[...t]:ArrayBuffer.isView(t)?new t.constructor(t):t}getUniformLocation(t){if(this.uniforms.has(t))return this.uniforms.get(t).location;let i=this.gl.getUniformLocation(this.program,t);return i!==null&&this.uniforms.set(t,{location:i,type:null,size:1,value:null}),i}getUniformsInfo(){return Object.fromEntries(this.uniforms)}compileShader(t,i){let r=this.gl.createShader(i);if(this.gl.shaderSource(r,t),this.gl.compileShader(r),!this.gl.getShaderParameter(r,this.gl.COMPILE_STATUS))throw new Error(`Shader compile error: ${this.gl.getShaderInfoLog(r)}`);return r}use(){this.gl.useProgram(this.program)}destroy(){this.gl.deleteProgram(this.program),this.uniforms.clear(),this.textureUnits.clear()}},xt=class{constructor(t,i,r,n=1){this.gl=t,this.width=i,this.height=r,this.floatSupported=t.getExtension("EXT_color_buffer_float"),this.textures=new Array(n),this.init(n)}init(t){let i=this.gl;this.fbo=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo);for(let r=0;r<t;r++)this.textures[r]=this.createTexture(),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+r,i.TEXTURE_2D,this.textures[r],0);t>1&&i.drawBuffers(Array.from({length:t},(r,n)=>i.COLOR_ATTACHMENT0+n)),i.bindFramebuffer(i.FRAMEBUFFER,null)}createTexture(){let t=this.gl,i=t.createTexture();t.bindTexture(t.TEXTURE_2D,i);let r=this.floatSupported?t.RGBA32F:t.RGBA,n=this.floatSupported?t.FLOAT:t.UNSIGNED_BYTE;return t.texImage2D(t.TEXTURE_2D,0,r,this.width,this.height,0,t.RGBA,n,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),i}begin(){let t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,this.fbo)}end(){let t=this.gl;t.bindFramebuffer(t.FRAMEBUFFER,null)}destroy(){let t=this.gl;t.deleteFramebuffer(this.fbo),t.deleteTexture(this.texture)}},H=class{constructor(t,i,r){this.shader=new dt(t,i,r),this.properties=new Map,this.textures=new Map,this.wireframeEnabled=!1,this.wireframeColor=[1,1,1,1]}static createTexture(t,i){let r=t.createTexture();return t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!0),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,i),r}static createDataTexture(t,i,r,n){let s=t.createTexture();return t.bindTexture(t.TEXTURE_2D,s),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,r,n,0,t.RGBA,t.FLOAT,i),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),s}setProperty(t,i){return this.properties.set(t,i),this}setTexture(t,i){return this.textures.set(t,i),this}setWireframe(t,i=null){return this.wireframeEnabled=t,i&&(this.wireframeColor=i),this}use(){this.shader.use();let t={};for(let[i,r]of this.properties.entries())t[i]=r;return this.shader.setUniforms(t),this.textures.size>0&&this.shader.setTextures(this.textures),this.shader}};var j=class e{constructor(){this.positions=[],this.normals=[],this.uvs=[],this.colors=[],this.move=[],this.vertices=[],this.edges=[],this.faces=[],this.indices=[],this.instanceCount=0,this.instancePositions=[],this.instanceRotations=[],this.instanceScales=[],this.instanceColors=[],this.vao=null,this.positionBuffer=null,this.normalBuffer=null,this.uvBuffer=null,this.colorBuffer=null,this.indexBuffer=null,this.moveBuffer=null,this.instancePositionBuffer=null,this.instanceRotationBuffer=null,this.instanceScaleBuffer=null,this.instanceColorBuffer=null,this.isInstance=!0}addVertex(t,i=[0,1,0],r=[0,0],n=[Math.random(),Math.random(),Math.random(),1],s=0){let o=this.vertices.length;return this.vertices.push({position:t.slice(),normal:i.slice(),uv:r.slice(),color:n.slice(),edges:[],faces:[],move:s}),this.positions.push(...t),this.normals.push(...i),this.uvs.push(...r),this.colors.push(...n),this.move.push(s),o}addEdge(t,i){let r={vertices:[t,i],faces:[]},n=this.edges.length;return this.edges.push(r),this.edgeIndices.push(t,i),this.vertices[t].edges.push(n),this.vertices[i].edges.push(n),n}addFace(t,i=[1,1,1,1]){let r={vertices:t.slice(),edges:[]},n=this.faces.length;this.faces.push(r);for(let s=1;s<t.length-1;s++)this.indices.push(t[0],t[s+1],t[s]);for(let s of t)this.vertices[s].faces.push(n);return n}addInstance(t=[0,0,0],i=[0,0,0,1],r=[1,1,1],n=[1,1,1,1]){this.instancePositions.push(...t),this.instanceRotations.push(...i),this.instanceScales.push(...r),this.instanceColors.push(...n),this.instanceCount++}getInstance(t){if(t<0||t>=this.instanceCount)return null;let i=t*3,r=t*4,n=t*3,s=t*4;return{position:this.instancePositions.slice(i,i+3),rotation:this.instanceRotations.slice(r,r+4),scale:this.instanceScales.slice(n,n+3),color:this.instanceColors.slice(s,s+4)}}clearInstances(){this.instancePositions=[],this.instanceRotations=[],this.instanceScales=[],this.instanceColors=[],this.instanceCount=0}computeNormalsOLD(){this.normals=new Array(this.positions.length).fill(0);for(let t=0;t<this.indices.length;t+=3){let i=this.indices[t]*3,r=this.indices[t+1]*3,n=this.indices[t+2]*3,s=this.positions.slice(i,i+3),o=this.positions.slice(r,r+3),a=this.positions.slice(n,n+3),l=[o[0]-s[0],o[1]-s[1],o[2]-s[2]],c=[a[0]-s[0],a[1]-s[1],a[2]-s[2]],h=[l[1]*c[2]-l[2]*c[1],l[2]*c[0]-l[0]*c[2],l[0]*c[1]-l[1]*c[0]];for(let f of[i,r,n])this.normals[f]+=h[0],this.normals[f+1]+=h[1],this.normals[f+2]+=h[2]}for(let t=0;t<this.normals.length;t+=3){let i=Math.sqrt(this.normals[t]*this.normals[t]+this.normals[t+1]*this.normals[t+1]+this.normals[t+2]*this.normals[t+2]);i>0&&(this.normals[t]/=i,this.normals[t+1]/=i,this.normals[t+2]/=i)}}computeNormalsSMOOTH(){console.log("normals!"),this.normals=new Array(this.positions.length).fill(0);for(let t=0;t<this.indices.length;t+=3){let i=this.indices[t]*3,r=this.indices[t+1]*3,n=this.indices[t+2]*3,s=this.positions.slice(i,i+3),o=this.positions.slice(r,r+3),a=this.positions.slice(n,n+3),l=[o[0]-s[0],o[1]-s[1],o[2]-s[2]],c=[a[0]-s[0],a[1]-s[1],a[2]-s[2]],h=[l[1]*c[2]-l[2]*c[1],l[2]*c[0]-l[0]*c[2],l[0]*c[1]-l[1]*c[0]];for(let f of[i,r,n])this.normals[f]+=h[0],this.normals[f+1]+=h[1],this.normals[f+2]+=h[2]}for(let t=0;t<this.normals.length;t+=3){let i=Math.sqrt(this.normals[t]*this.normals[t]+this.normals[t+1]*this.normals[t+1]+this.normals[t+2]*this.normals[t+2]);i>0&&(this.normals[t]/=i,this.normals[t+1]/=i,this.normals[t+2]/=i);let r=t/3;this.vertices[r]&&(this.vertices[r].normal=[this.normals[t],this.normals[t+1],this.normals[t+2]])}}computeNormals(){this.normals=new Array(this.positions.length).fill(0);for(let t=0;t<this.indices.length;t+=3){let i=this.indices[t]*3,r=this.indices[t+1]*3,n=this.indices[t+2]*3,s=this.positions.slice(i,i+3),o=this.positions.slice(r,r+3),a=this.positions.slice(n,n+3),l=[o[0]-s[0],o[1]-s[1],o[2]-s[2]],c=[a[0]-s[0],a[1]-s[1],a[2]-s[2]],h=[l[1]*c[2]-l[2]*c[1],l[2]*c[0]-l[0]*c[2],l[0]*c[1]-l[1]*c[0]],f=Math.sqrt(h[0]*h[0]+h[1]*h[1]+h[2]*h[2]);f>0&&(h[0]/=f,h[1]/=f,h[2]/=f);for(let d of[i,r,n])this.normals[d]=h[0],this.normals[d+1]=h[1],this.normals[d+2]=h[2]}for(let t=0;t<this.normals.length;t+=3){let i=t/3;this.vertices[i]&&(this.vertices[i].normal=[this.normals[t],this.normals[t+1],this.normals[t+2]])}}initBuffers(t){this.vao=t.createVertexArray(),t.bindVertexArray(this.vao),this.positionBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.positions),t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,0,0),this.normalBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.normalBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.normals),t.STATIC_DRAW),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,3,t.FLOAT,!1,0,0),this.uvBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.uvBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.uvs),t.STATIC_DRAW),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,2,t.FLOAT,!1,0,0),this.colorBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.colorBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.colors),t.STATIC_DRAW),t.enableVertexAttribArray(3),t.vertexAttribPointer(3,4,t.FLOAT,!1,0,0),this.instancePositionBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.instancePositionBuffer),t.enableVertexAttribArray(4),t.vertexAttribPointer(4,3,t.FLOAT,!1,0,0),t.vertexAttribDivisor(4,1),this.instanceRotationBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.instanceRotationBuffer),t.enableVertexAttribArray(5),t.vertexAttribPointer(5,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(5,1),this.instanceScaleBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.instanceScaleBuffer),t.enableVertexAttribArray(6),t.vertexAttribPointer(6,3,t.FLOAT,!1,0,0),t.vertexAttribDivisor(6,1),this.instanceColorBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.instanceColorBuffer),t.enableVertexAttribArray(7),t.vertexAttribPointer(7,4,t.FLOAT,!1,0,0),t.vertexAttribDivisor(7,1),this.moveBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.moveBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.move),t.STATIC_DRAW),t.enableVertexAttribArray(8),t.vertexAttribPointer(8,1,t.FLOAT,!1,0,0),this.indices.length>0&&(this.indexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),t.STATIC_DRAW),this.edgeBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.edgeBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.edges),t.STATIC_DRAW)),t.bindVertexArray(null)}updateBuffers(t){t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.positions),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.normalBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.normals),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.uvBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.uvs),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.colorBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.colors),t.STATIC_DRAW),this.indexBuffer&&(t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),t.STATIC_DRAW)),t.bindVertexArray(null)}updateInstanceData(t){t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.instancePositionBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.instancePositions),t.DYNAMIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.instanceRotationBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.instanceRotations),t.DYNAMIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.instanceScaleBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.instanceScales),t.DYNAMIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.instanceColorBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.instanceColors),t.DYNAMIC_DRAW),t.bindVertexArray(null)}updateVertex(t,i){if(t<0||t>=this.vertices.length)return;let r=t*3;this.positions[r]=i[0],this.positions[r+1]=i[1],this.positions[r+2]=i[2],this.vertices[t].position=[...i]}updateTransform(t=0,i=null,r=null,n=null){if(t<0||t>=this.instanceCount){console.error("Invalid instance index");return}if(i){let s=t*3;this.instancePositions[s]=i[0],this.instancePositions[s+1]=i[1],this.instancePositions[s+2]=i[2]}if(r){let s=t*4;this.instanceRotations[s]=r[0],this.instanceRotations[s+1]=r[1],this.instanceRotations[s+2]=r[2],this.instanceRotations[s+3]=r[3]}if(n){let s=t*3;this.instanceScales[s]=n[0],this.instanceScales[s+1]=n[1],this.instanceScales[s+2]=n[2]}}generateEdges(){let t=new Set;for(let i of this.faces){let r=(s,o)=>{let a=s<o?`${s},${o}`:`${o},${s}`;t.add(a)},n=i.vertices;r(n[0],n[1]),r(n[1],n[2]),r(n[2],n[0])}this.edges=[],Array.from(t).forEach(i=>{let[r,n]=i.split(",").map(Number);this.edges.push(r,n)})}renderWithMaterial(t,i){if(this.instanceCount===0)return;let r=i.use();t.bindVertexArray(this.vao),this.indexBuffer?(t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer),t.enable(t.POLYGON_OFFSET_FILL),i.wireframeEnabled&&t.polygonOffset(1,1),r.setUniform("uWire",0),t.drawElementsInstanced(t.TRIANGLES,this.indices.length,t.UNSIGNED_SHORT,0,this.instanceCount),i.wireframeEnabled&&this.edgeBuffer&&(t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.edgeBuffer),t.disable(t.POLYGON_OFFSET_FILL),r.setUniform("uWire",1),t.drawElementsInstanced(t.LINES,this.edges.length,t.UNSIGNED_SHORT,0,this.instanceCount))):t.drawArraysInstanced(t.TRIANGLES,0,this.positions.length/3,this.instanceCount),t.bindVertexArray(null)}dispose(t){this.vao&&t.deleteVertexArray(this.vao),this.positionBuffer&&t.deleteBuffer(this.positionBuffer),this.normalBuffer&&t.deleteBuffer(this.normalBuffer),this.uvBuffer&&t.deleteBuffer(this.uvBuffer),this.colorBuffer&&t.deleteBuffer(this.colorBuffer),this.indexBuffer&&t.deleteBuffer(this.indexBuffer),this.instancePositionBuffer&&t.deleteBuffer(this.instancePositionBuffer),this.instanceRotationBuffer&&t.deleteBuffer(this.instanceRotationBuffer),this.instanceScaleBuffer&&t.deleteBuffer(this.instanceScaleBuffer),this.instanceColorBuffer&&t.deleteBuffer(this.instanceColorBuffer)}static mergeVertices(t,i=1e-4){let r=i*i,n=new Map,s=new Map,o=[],a=c=>{let h=1/i;return`${Math.floor(c[0]*h)},${Math.floor(c[1]*h)},${Math.floor(c[2]*h)}`};t.vertices.forEach((c,h)=>{let f=a(c.position);n.has(f)||n.set(f,[]);let d=!1;for(let u of n.get(f)){let m=c.position[0]-u.vertex.position[0],g=c.position[1]-u.vertex.position[1],p=c.position[2]-u.vertex.position[2];if(m*m+g*g+p*p<=r){s.set(h,u.newIndex),d=!0;break}}if(!d){let u=o.length;s.set(h,u),o.push(c),n.get(f).push({vertex:c,newIndex:u})}});let l=new e;for(let c of o)l.addVertex(c.position,c.normal,c.uv,c.color,c.move);for(let c of t.faces){let h=c.vertices.map(f=>s.get(f));new Set(h).size===h.length&&l.addFace(h)}for(let c=0;c<t.instanceCount;c++){let h=c*3,f=c*4,d=c*3,u=c*4;l.addInstance(t.instancePositions.slice(h,h+3),t.instanceRotations.slice(f,f+4),t.instanceScales.slice(d,d+3),t.instanceColors.slice(u,u+4))}return l.generateEdges(),l.computeNormals(),l}static merge(t){if(!t||t.length===0)return new e;let i=new e,r=0;for(let n of t){for(let s=0;s<n.vertices.length;s++){let o=n.vertices[s];i.addVertex(o.position,o.normal,o.uv,o.color,o.move)}for(let s of n.faces){let o=s.vertices.map(a=>a+r);i.addFace(o)}for(let s=0;s<n.instanceCount;s++){let o=s*3,a=s*4,l=s*3,c=s*4;i.addInstance(n.instancePositions.slice(o,o+3),n.instanceRotations.slice(a,a+4),n.instanceScales.slice(l,l+3),n.instanceColors.slice(c,c+4))}r+=n.vertices.length}return i.generateEdges(),i}};var zt=class extends j{constructor(){super(),this.polylines=[],this.lineSegmentCount=0,this.edgeIndices=[],this.renderPoints=!1}addPolyline(t,i=[1,1,1,1],r){if(!t||t.length<2)return console.error("Polyline needs at least 2 points"),-1;let n=this.polylines.length,s=[],o=this.vertices.length,a=t.map((l,c)=>this.addVertex(l,[0,0,1],[0,0],i,r[c]));for(let l=0;l<t.length-1;l++){let c=a[l],h=a[l+1];this.edgeIndices.push(c,h);let f=this.addEdge(c,h);s.push({vertices:[c,h],edge:f})}return this.polylines.push({points:t.map(l=>[...l]),color:[...i],segments:s,vertexIndices:a}),this.lineSegmentCount+=s.length,n}createInstance(t=[0,0,0],i=[0,0,0,1],r=[1,1,1],n=[1,1,1,1]){this.addInstance(t,i,r,n)}updatePolyline(t,i){if(t<0||t>=this.polylines.length){console.error("Invalid polyline index");return}let r=this.polylines[t];for(let n=0;n<Math.min(i.length,r.vertexIndices.length);n++){let s=r.vertexIndices[n],o=i[n],a=s*3;this.positions[a]=o[0],this.positions[a+1]=o[1],this.positions[a+2]=o[2]}r.points=i.map(n=>[...n])}generateEdges(){let t=new Set;for(let i of this.polylines)for(let r of i.segments){let[n,s]=r.vertices,o=n<s?`${n},${s}`:`${s},${n}`;t.add(o)}this.edges=[],Array.from(t).forEach(i=>{let[r,n]=i.split(",").map(Number);this.edges.push(r,n)})}renderWithMaterialOld(t,i){if(this.instanceCount===0||this.edgeIndices.length===0)return;let r=i.use();t.bindVertexArray(this.vao),this.edgeIndexBuffer?t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.edgeIndexBuffer):(this.edgeIndexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.edgeIndexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.edges),t.STATIC_DRAW)),t.drawElementsInstanced(t.LINES,this.edgeIndices.length,t.UNSIGNED_SHORT,0,this.instanceCount),this.renderPoints&&t.drawElementsInstanced(t.POINTS,this.edgeIndices.length,t.UNSIGNED_SHORT,0,this.instanceCount),t.bindVertexArray(null)}renderWithMaterial(t,i){if(this.instanceCount===0||this.edges.length===0)return;let r=i.use();t.bindVertexArray(this.vao),this.edgeIndexBuffer?t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.edgeIndexBuffer):(this.edgeIndexBuffer=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.edgeIndexBuffer),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.edges),t.STATIC_DRAW)),r.setUniform("uWire",1),t.drawElementsInstanced(t.LINES,this.edges.length,t.UNSIGNED_SHORT,0,this.instanceCount),r.setUniform("uWire",0),this.renderPoints&&t.drawElementsInstanced(t.POINTS,this.edges.length,t.UNSIGNED_SHORT,0,this.instanceCount),t.bindVertexArray(null)}getLineSegmentCount(){return this.lineSegmentCount}prepare(t){this.edges=this.edgeIndices,this.initBuffers(t)}dispose(t){super.dispose(t),this.edgeIndexBuffer&&t.deleteBuffer(this.edgeIndexBuffer)}generateLattice(t,i,r,n,s,o){let a=[],l=[];for(let c=0;c<n;c++)for(let h=0;h<s;h++)for(let f=0;f<o;f++)a.push([h*t,c*i,f*r]);for(let c=0;c<n;c++)for(let h=0;h<s;h++)for(let f=0;f<o;f++){let d=c*s*o+h*o+f;for(let u=-1;u<=1;u++)for(let m=-1;m<=1;m++)for(let g=-1;g<=1;g++){if(u===0&&m===0&&g===0)continue;let p=c+u,v=h+m,A=f+g;if(p>=0&&p<n&&v>=0&&v<s&&A>=0&&A<o){let y=p*s*o+v*o+A;d<y&&this.addPolyline([a[d],a[y]],[1,1,1,1],[0,0])}}}}};var Me=class{constructor(t,i,r,n){this.points=[x.clone(t),x.clone(i),x.clone(r),x.clone(n)],this.dpoints=this.calculateDerivative()}calculateDerivative(){let t=this.points,i=[],r=x.create();return x.subtract(r,t[1],t[0]),x.scale(r,r,3),i[0]=x.clone(r),x.subtract(r,t[2],t[1]),x.scale(r,r,3),i[1]=x.clone(r),x.subtract(r,t[3],t[2]),x.scale(r,r,3),i[2]=x.clone(r),i}get(t){let i=1-t,r=i*i,n=r*i,s=t*t,o=s*t,a=this.points,l=x.create(),c=x.create();return x.scale(l,a[0],n),x.scale(c,a[1],3*r*t),x.add(l,l,c),x.scale(c,a[2],3*i*s),x.add(l,l,c),x.scale(c,a[3],o),x.add(l,l,c),l}getDerivative(t){let i=1-t,r=i*i,n=t*t,s=this.dpoints,o=x.create(),a=x.create();return x.scale(o,s[0],r),x.scale(a,s[1],2*i*t),x.add(o,o,a),x.scale(a,s[2],n),x.add(o,o,a),o}getSecondDerivative(t){let i=1-t,r=this.dpoints,n=x.create(),s=x.create(),o=x.create();return x.subtract(o,r[1],r[0]),x.scale(s,o,2*i),x.copy(n,s),x.subtract(o,r[2],r[1]),x.scale(s,o,2*t),x.add(n,n,s),n}},ye=class{constructor(t){this.controlPoints=t.map(i=>i.length>=3||Array.isArray(i)?x.clone(i):x.fromValues(i.x||0,i.y||0,i.z||0)),this.segments=this.createSegments(),this.ensureContinuity()}createSegments(){let t=[];for(let i=0;i<this.controlPoints.length-3;i+=3)t.push(new Me(this.controlPoints[i],this.controlPoints[i+1],this.controlPoints[i+2],this.controlPoints[i+3]));return t}ensureContinuity(){for(let t=1;t<this.segments.length;t++){let i=this.segments[t-1],r=this.segments[t];x.copy(r.points[0],i.points[3]);let n=x.create();x.subtract(n,i.points[3],i.points[2]);let s=x.create();x.subtract(s,r.points[1],r.points[0]);let o=x.length(s);if(x.length(n)>0){let l=x.create();x.normalize(l,n),x.scale(l,l,o),x.add(r.points[1],r.points[0],l)}r.dpoints=r.calculateDerivative()}this.segments.length>0&&(this.segments[0].dpoints=this.segments[0].calculateDerivative())}closeCurve(){if(this.controlPoints.length<4)throw new Error("Need at least 4 control points to close a curve");x.copy(this.controlPoints[this.controlPoints.length-1],this.controlPoints[0]);let t=x.create();x.subtract(t,this.controlPoints[1],this.controlPoints[0]);let i=x.create();x.subtract(i,this.controlPoints[this.controlPoints.length-1],this.controlPoints[this.controlPoints.length-2]);let r=x.create();x.add(r,t,i),x.scale(r,r,.5);let n=x.length(t),s=x.length(i);if(x.length(r)>0){let o=x.create();x.normalize(o,r),x.scale(o,o,n),x.add(this.controlPoints[1],this.controlPoints[0],o);let a=x.create();x.normalize(a,r),x.scale(a,a,-s),x.add(this.controlPoints[this.controlPoints.length-2],this.controlPoints[this.controlPoints.length-1],a)}this.segments=this.createSegments(),this.ensureContinuity()}get(t){let i=this.segments.length,r=t*i,n=Math.min(Math.floor(r),i-1),s=r-n;return this.segments[n].get(s)}getDerivative(t){let i=this.segments.length,r=t*i,n=Math.min(Math.floor(r),i-1),s=r-n,o=this.segments[n].getDerivative(s),a=x.create();return x.scale(a,o,i),a}getSecondDerivative(t){let i=this.segments.length,r=t*i,n=Math.min(Math.floor(r),i-1),s=r-n,o=this.segments[n].getSecondDerivative(s),a=x.create();return x.scale(a,o,i*i),a}addControlPoint(t,i=null){let r=Array.isArray(t)?x.clone(t):x.fromValues(t.x,t.y,t.z);i===null?this.controlPoints.push(r):this.controlPoints.splice(i,0,r),this.segments=this.createSegments(),this.ensureContinuity()}removeControlPoint(t){this.controlPoints.length>4&&(this.controlPoints.splice(t,1),this.segments=this.createSegments(),this.ensureContinuity())}subdivide(t){if(t<2)throw new Error("Number of points must be at least 2");let i=[],r=1/(t-1);for(let n=0;n<t;n++){let s=n*r,o=Math.max(0,Math.min(1,s));i.push(this.get(o))}return i}subdivideByStep(t){if(t<=0||t>1)throw new Error("Step size must be between 0 (exclusive) and 1 (inclusive)");let i=[],r=0;for(;r<=1;)i.push(this.get(r)),r+=t;return(i.length===0||r-t<1)&&i.push(this.get(1)),i}scale(t){let i=typeof t=="number"?x.fromValues(t,t,t):x.clone(t);for(let r=0;r<this.controlPoints.length;r++)x.multiply(this.controlPoints[r],this.controlPoints[r],i);this.segments=this.createSegments(),this.ensureContinuity()}translate(t){let i=Array.isArray(t)?x.clone(t):t.x!==void 0?x.fromValues(t.x,t.y,t.z):x.clone(t);for(let r=0;r<this.controlPoints.length;r++)x.add(this.controlPoints[r],this.controlPoints[r],i);this.segments=this.createSegments(),this.ensureContinuity()}},kt=class{static generate(t={}){let{numWaypoints:i=10,minRadius:r=50,maxRadius:n=120,straightProbability:s=.3,roughness:o=.4,amplitude:a=5,rfunc:l}=t,c=[];for(let d=0;d<i;d++){let u=d/i*Math.PI*2,m=r+l()*(n-r),g=Math.cos(u)*m,p=(l()-0)*a,v=Math.sin(u)*m;c.push(x.fromValues(g,p,v))}let h=[];for(let d=0;d<i;d++){let u=c[d],m=c[(d+1)%i],g=c[(d-1+i)%i],p=c[(d+2)%i],v=x.create();x.subtract(v,m,g),this._safeNormalize(v,v);let A=x.create();x.subtract(A,p,u),this._safeNormalize(A,A);let M=x.distance(u,m)*.3*(1+(l()-.5)*o),w=x.create();x.scaleAndAdd(w,u,v,M);let P=x.create();if(x.scaleAndAdd(P,m,A,-M),l()<s){let T=x.create();x.subtract(T,m,u),x.scaleAndAdd(w,u,T,.33),x.scaleAndAdd(P,u,T,.66)}h.push(x.clone(u)),h.push(w),h.push(P)}h.push(x.clone(h[0]));let f=new ye(h);return f.closeCurve(),f}static _safeNormalize(t,i){let r=x.length(i);r>1e-6?x.scale(t,i,1/r):x.set(t,0,0,1)}};var St=class extends j{constructor(t=10,i=10,r=2,n=2,s={}){super(),this.width=t,this.height=i,this.normal=[0,1,0],this.rows=r,this.cols=n,this.originalPositions=[],this.edgeIndices=[];let{color:o=[1,1,1,1],uvScale:a=1,offset:l=[0,0,0]}=s;this.position=x.fromValues(0,0,0),this.rotation=b.create(),this.generateGrid(o,a,l),this.generateFaces(),this.generateEdges(),this.computeNormals(),this.originalPositions=this.vertices.map(c=>c.position.slice())}generateGrid(t,i,r){let n=this.width/(this.cols-1),s=this.height/(this.rows-1);for(let o=0;o<this.rows;o++)for(let a=0;a<this.cols;a++){let l=a*n-this.width/2,c=0,h=o*s-this.height/2,f=a/(this.cols-1)*i,d=o/(this.rows-1)*i,u=[0,1,0];this.addVertex([l+r[0],c+r[1],h+r[2]],u,[f,d],t)}}generateFaces(){for(let t=0;t<this.rows-1;t++)for(let i=0;i<this.cols-1;i++){let r=t*this.cols+i,n=r+1,s=r+this.cols,o=s+1;this.addEdge(r,s),this.addEdge(s,n),this.addEdge(n,r),this.addEdge(s,o),this.addEdge(o,n),this.addEdge(n,s),this.addFace([r,s,n]),this.addFace([n,s,o])}}addEdge(t,i){let r={vertices:[t,i],faces:[]},n=this.edges.length;return this.edges.push(r),this.edgeIndices.push(t,i),this.vertices[t].edges.push(n),this.vertices[i].edges.push(n),n}applyTransformation(t){for(let i=0;i<this.vertices.length;i++){let r=this.vertices[i],n=r.position.slice(),s=t(n,i);r.position=s;let o=i*3;this.positions[o]=s[0],this.positions[o+1]=s[1],this.positions[o+2]=s[2]}this.computeNormals()}updateFromParticles(t,i,r){for(let n=0;n<i;n++)for(let s=0;s<r;s++){let o=s*i+n,a=t[n][s];if(o<this.vertices.length&&a){this.vertices[o].position[0]=a.pose.p.x,this.vertices[o].position[1]=a.pose.p.y,this.vertices[o].position[2]=a.pose.p.z;let l=o*3;this.positions[l]=a.pose.p.x,this.positions[l+1]=a.pose.p.y,this.positions[l+2]=a.pose.p.z}}this.computeNormals()}applyNoise(t,i=1,r=1){this.applyTransformation((n,s)=>{let o=i*Math.sin(n[0]*r)*Math.cos(n[2]*r);return[n[0],n[1]+o,n[2]]})}applyWave(t=1,i=1,r=0){this.applyTransformation((n,s)=>{let o=this.originalPositions[s],a=n[0]-0,l=n[2]-0,c=Math.sqrt(a*a+l*l),h=1/(1+c*.5),f=t*h*Math.sin(i*(c+r*2));return[o[0],o[1]+f,o[2]]})}applyWaveAvoidingSpline(t=1,i=1,r=0,n,s=1){this.applyTransformation((o,a)=>{let l=this.originalPositions[a],c=1/0;for(let A=0;A<n.length;A++){let y=n[A],M=l[0]-y[0],w=l[2]-y[2],P=M*M+w*w;P<c&&(c=P)}let h=Math.sqrt(c),f=Math.max(0,Math.min(1,h/s)),d=f*f*(3-2*f),u=l[0],m=l[2],g=Math.sqrt(u*u+m*m),p=1/(1+g*.5),v=t*p*Math.sin(i*(g+r*2));return[l[0],l[1]+3*d,l[2]]})}applyNoiseAvoidingSpline(t,i=1,r=0,n,s=1){this.applyTransformation((o,a)=>{let l=this.originalPositions[a],c=1/0;for(let m=0;m<n.length;m++){let g=n[m],p=l[0]-g[0],v=l[2]-g[2],A=p*p+v*v;A<c&&(c=A)}let h=Math.sqrt(c),f=Math.max(0,Math.min(1,h/s)),d=f*f*f*f,u=t(l[0],l[1],l[2],r,10,2);return[l[0],l[1]+i*u*d,l[2]]})}updateBuffers(t){t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.positionBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.positions),t.STATIC_DRAW),t.bindBuffer(t.ARRAY_BUFFER,this.normalBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array(this.normals),t.STATIC_DRAW),t.bindVertexArray(null)}};var Ht=class{constructor(t,i=512){this.gl=t,this.size=i,this.depthTexture=null,this.framebuffer=null,this.init()}init(){let t=this.gl;this.depthTexture=t.createTexture(),t.bindTexture(t.TEXTURE_2D,this.depthTexture),t.texImage2D(t.TEXTURE_2D,0,t.DEPTH_COMPONENT32F,this.size,this.size,0,t.DEPTH_COMPONENT,t.FLOAT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.framebuffer=t.createFramebuffer(),t.bindFramebuffer(t.FRAMEBUFFER,this.framebuffer),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,this.depthTexture,0);let i=t.checkFramebufferStatus(t.FRAMEBUFFER);i!==t.FRAMEBUFFER_COMPLETE&&console.error("Framebuffer is not complete:",i),t.bindFramebuffer(t.FRAMEBUFFER,null)}bind(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.framebuffer),this.gl.viewport(0,0,this.size,this.size)}unbind(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null)}getTexture(){return this.depthTexture}resize(t){this.size=t,this.destroy(),this.init()}destroy(){let t=this.gl;this.depthTexture&&t.deleteTexture(this.depthTexture),this.framebuffer&&t.deleteFramebuffer(this.framebuffer)}};var Ii=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 4) in vec3 aInstancePosition;
layout(location = 5) in vec4 aInstanceRotation;
layout(location = 6) in vec3 aInstanceScale;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

// Quaternion rotation function
mat4 quatToMat4(vec4 q) {
    float x = q.x, y = q.y, z = q.z, w = q.w;
    float x2 = x + x, y2 = y + y, z2 = z + z;
    float xx = x * x2, xy = x * y2, xz = x * z2;
    float yy = y * y2, yz = y * z2, zz = z * z2;
    float wx = w * x2, wy = w * y2, wz = w * z2;
    
    return mat4(
        1.0 - (yy + zz), xy + wz, xz - wy, 0.0,
        xy - wz, 1.0 - (xx + zz), yz + wx, 0.0,
        xz + wy, yz - wx, 1.0 - (xx + yy), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

void main() {
    // Build instance transform matrix
    mat4 rotation = quatToMat4(aInstanceRotation);
    mat4 scale = mat4(
        aInstanceScale.x, 0.0, 0.0, 0.0,
        0.0, aInstanceScale.y, 0.0, 0.0,
        0.0, 0.0, aInstanceScale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 translation = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        aInstancePosition.x, aInstancePosition.y, aInstancePosition.z, 1.0
    );
    
    // Combine: Translation * Rotation * Scale
    mat4 instanceMatrix = translation * rotation * scale;
    mat4 finalModel = uModel * instanceMatrix;
    
    gl_Position = uProjection * uView * finalModel * vec4(aPosition, 1.0);
}
`,Di=`#version 300 es
precision highp float;

uniform float uWire;

void main() {
    float d = uWire * 0.0;
  // Depth is automatically written to depth buffer
  // No color output needed
}
`;var jt=class{constructor(t){this.gl=t,this.shadowMap=null,this.shadowMaterial=null,this.textureMatrix=D.create()}setup(t){!t||!t.castShadow||((!this.shadowMap||this.shadowMap.size!==t.shadowMapSize)&&(this.shadowMap&&this.shadowMap.destroy(),this.shadowMap=new Ht(this.gl,t.shadowMapSize)),this.shadowMaterial||(this.shadowMaterial=new H(this.gl,Ii,Di)))}renderShadowPass(t,i){if(!i||!i.castShadow||!this.shadowMap)return;let r=this.gl;this.shadowMap.bind(),r.clear(r.DEPTH_BUFFER_BIT),r.colorMask(!1,!1,!1,!1),t.traverse(n=>{n.visible&&n.geometry&&n.castShadow!==!1&&(n.updateMatrix(),this.shadowMaterial.setProperty("uProjection",i.projectionMatrix),this.shadowMaterial.setProperty("uView",i.viewMatrix),this.shadowMaterial.setProperty("uModel",i.modelMatrix),this.shadowMaterial.use(),n.geometry.updateBuffers(r),n.geometry.isInstance&&n.geometry.updateInstanceData(r),n.geometry.renderWithMaterial(r,this.shadowMaterial))}),r.colorMask(!0,!0,!0,!0),this.shadowMap.unbind(),this.calculateTextureMatrix(i)}calculateTextureMatrix(t){D.identity(this.textureMatrix),D.translate(this.textureMatrix,this.textureMatrix,[.5,.5,.5]),D.scale(this.textureMatrix,this.textureMatrix,[.5,.5,.5]),D.multiply(this.textureMatrix,this.textureMatrix,t.projectionMatrix),D.multiply(this.textureMatrix,this.textureMatrix,t.viewMatrix)}getShadowTexture(){return this.shadowMap?this.shadowMap.getTexture():null}getTextureMatrix(){return this.textureMatrix}destroy(){this.shadowMap&&this.shadowMap.destroy(),this.shadowMaterial&&this.shadowMaterial.shader.destroy()}};var Ft=class{constructor(t,i={}){if(this.canvas=t,this.gl=t.getContext("webgl2",{antialias:i.antialias||!1,preserveDrawingBuffer:i.preserveDrawingBuffer||!0,premultipliedAlpha:i.premultipliedAlpha||!1,...i}),!this.gl)throw new Error("WebGL 2 not supported");this.width=t.width,this.height=t.height,this.aspect=this.width/this.height,this.clearColor=[0,0,0,1],this.enableDepthTest=!0,this.enableBlend=!0,this.directionalLight=null,this.shadowRenderer=new jt(this.gl),this.init()}init(){let t=this.gl;t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float"),this.enableDepthTest&&(t.enable(t.DEPTH_TEST),t.depthFunc(t.LESS)),this.enableBlend&&(t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA))}setSize(t,i){this.canvas.width=t,this.canvas.height=i,this.width=t,this.height=i,this.aspect=t/i,this.gl.viewport(0,0,t,i)}setClearColor(t,i,r,n=1){this.clearColor=[t,i,r,n]}clear(){let t=this.gl;t.clearColor(...this.clearColor),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT)}setDirectionalLight(t){this.directionalLight=t,this.shadowRenderer.setup(t)}render(t,i){let r=this.gl;this.directionalLight&&this.directionalLight.castShadow&&this.shadowRenderer.renderShadowPass(t,this.directionalLight),this.renderMainPass(t,i)}renderMainPass(t,i){this.gl.viewport(0,0,this.canvas.width,this.canvas.height),this.clear(),i.updateMatrices(this.canvas.width/this.canvas.height);let n=this.shadowRenderer.getShadowTexture(),s=this.shadowRenderer.getTextureMatrix();t.traverse(o=>{if(o.visible&&o.geometry&&o.material){o.updateMatrix();let a=o.material;a.setProperty("uProjection",i.projectionMatrix),a.setProperty("uView",i.viewMatrix),a.setProperty("uModel",i.modelMatrix),this.directionalLight&&(a.setProperty("uLightDirection",this.directionalLight.getReversedDirection()),a.setProperty("uLightColor",this.directionalLight.color),a.setProperty("uLightIntensity",this.directionalLight.intensity),this.directionalLight.castShadow&&n&&(a.setProperty("uTextureMatrix",s),a.setProperty("uShadowBias",this.directionalLight.shadowBias),a.setTexture("uShadowMap",n))),a.use(),this.renderObject(o)}})}renderObject(t,i){let r=t.material,n=t.geometry;n.updateBuffers(this.gl),n.isInstance&&n.updateInstanceData(this.gl),n.renderWithMaterial(this.gl,r)}};var Ae=class{constructor(){this.position=x.fromValues(0,0,0),this.target=x.fromValues(0,0,0),this.up=x.fromValues(0,1,0),this.projectionMatrix=D.create(),this.viewMatrix=D.create(),this.modelMatrix=D.create(),D.lookAt(this.viewMatrix,this.position,this.target,this.up)}setPosition(t,i,r){x.set(this.position,t,i,r),D.lookAt(this.viewMatrix,this.position,this.target,this.up)}setRotation(t){let i=x.create();x.subtract(i,this.position,this.target),x.transformQuat(i,i,t),x.add(this.position,this.target,i),x.transformQuat(this.up,this.up,t),D.lookAt(this.viewMatrix,this.position,this.target,this.up)}lookAt(t,i=[0,1,0]){this.target=t,this.up=i,D.lookAt(this.viewMatrix,this.position,this.target,this.up)}updateMatrices(t){}};var Zt=class extends Ae{constructor(t=85,i=1,r=.001,n=1e3){super(),this.fov=t,this.aspect=i,this.near=r,this.far=n,this.currentLookAt=x.create(),this.currentUp=x.fromValues(0,1,0),this.smoothCamPos=x.create(),this.smoothCamUp=x.create(),x.set(this.smoothCamUp,0,1,0)}updateMatrices(t){this.aspect=t,D.perspective(this.projectionMatrix,this.fov*Math.PI/180,this.aspect,this.near,this.far)}smoothLookAt(t,i,r,n=5){let s=r>1?r/1e3:r,o=1-Math.exp(-n*s);x.lerp(this.target,this.target,t,o),x.lerp(this.up,this.up,i,o),x.normalize(this.up,this.up),D.lookAt(this.viewMatrix,this.position,this.target,this.up)}};var It=class{constructor(){this.children=[]}add(t){this.children.push(t),t.parent=this}remove(t){let i=this.children.indexOf(t);i>-1&&(this.children.splice(i,1),t.parent=null)}traverse(t){t(this);for(let i of this.children)i.traverse?i.traverse(t):t(i)}};var Z=class{constructor(){this.position=x.fromValues(0,0,0),this.rotation=b.create(),this.scale=x.fromValues(1,1,1),this.matrixWorld=D.create(),this.parent=null,this.children=[],this.geometry=null,this.material=null,this.visible=!0,this.castShadow=!1}add(t){this.children.push(t),t.parent=this}remove(t){let i=this.children.indexOf(t);i>-1&&(this.children.splice(i,1),t.parent=null)}translate(t,i,r){return x.add(this.position,this.position,x.fromValues(t,i,r)),this}setPosition(t,i,r){return x.set(this.position,t,i,r),this}rotateX(t){let i=b.create();return b.setAxisAngle(i,[1,0,0],t),b.multiply(this.rotation,this.rotation,i),this}rotateY(t){let i=b.create();return b.setAxisAngle(i,[0,1,0],t),b.multiply(this.rotation,this.rotation,i),this}rotateZ(t){let i=b.create();return b.setAxisAngle(i,[0,0,1],t),b.multiply(this.rotation,this.rotation,i),this}setRotation(t,i,r){return b.identity(this.rotation),this.rotateX(t).rotateY(i).rotateZ(r),this}scaleBy(t,i,r){return x.multiply(this.scale,this.scale,x.fromValues(t,i,r)),this}scaleUniform(t){return x.scale(this.scale,this.scale,t),this}setScale(t,i,r){return x.set(this.scale,t,i,r),this}updateMatrix(){D.identity(this.matrixWorld),D.translate(this.matrixWorld,this.matrixWorld,this.position);let t=D.create();D.fromQuat(t,this.rotation),D.multiply(this.matrixWorld,this.matrixWorld,t),D.scale(this.matrixWorld,this.matrixWorld,this.scale)}traverse(t){t(this);for(let i of this.children)i.traverse(t)}};var Bi=new Uint16Array([0,265,515,778,1030,1295,1541,1804,2060,2309,2575,2822,3082,3331,3593,3840,400,153,915,666,1430,1183,1941,1692,2460,2197,2975,2710,3482,3219,3993,3728,560,825,51,314,1590,1855,1077,1340,2620,2869,2111,2358,3642,3891,3129,3376,928,681,419,170,1958,1711,1445,1196,2988,2725,2479,2214,4010,3747,3497,3232,1120,1385,1635,1898,102,367,613,876,3180,3429,3695,3942,2154,2403,2665,2912,1520,1273,2035,1786,502,255,1013,764,3580,3317,4095,3830,2554,2291,3065,2800,1616,1881,1107,1370,598,863,85,348,3676,3925,3167,3414,2650,2899,2137,2384,1984,1737,1475,1226,966,719,453,204,4044,3781,3535,3270,3018,2755,2505,2240,2240,2505,2755,3018,3270,3535,3781,4044,204,453,719,966,1226,1475,1737,1984,2384,2137,2899,2650,3414,3167,3925,3676,348,85,863,598,1370,1107,1881,1616,2800,3065,2291,2554,3830,4095,3317,3580,764,1013,255,502,1786,2035,1273,1520,2912,2665,2403,2154,3942,3695,3429,3180,876,613,367,102,1898,1635,1385,1120,3232,3497,3747,4010,2214,2479,2725,2988,1196,1445,1711,1958,170,419,681,928,3376,3129,3891,3642,2358,2111,2869,2620,1340,1077,1855,1590,314,51,825,560,3728,3993,3219,3482,2710,2975,2197,2460,1692,1941,1183,1430,666,915,153,400,3840,3593,3331,3082,2822,2575,2309,2060,1804,1541,1295,1030,778,515,265,0]),Dt=new Int8Array([0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,1,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,1,8,3,9,8,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,0,8,3,1,2,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,9,2,10,0,2,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,8,3,2,10,8,10,9,8,-1,-1,-1,-1,-1,-1,3,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,0,11,2,8,11,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,1,9,0,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,1,11,2,1,9,11,9,8,11,-1,-1,-1,-1,-1,-1,6,3,10,1,11,10,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,10,1,0,8,10,8,11,10,-1,-1,-1,-1,-1,-1,9,3,9,0,3,11,9,11,10,9,-1,-1,-1,-1,-1,-1,6,9,8,10,10,8,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,4,3,0,7,3,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,0,1,9,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,4,1,9,4,7,1,7,3,1,-1,-1,-1,-1,-1,-1,6,1,2,10,8,4,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,4,7,3,0,4,1,2,10,-1,-1,-1,-1,-1,-1,9,9,2,10,9,0,2,8,4,7,-1,-1,-1,-1,-1,-1,12,2,10,9,2,9,7,2,7,3,7,9,4,-1,-1,-1,6,8,4,7,3,11,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,11,4,7,11,2,4,2,0,4,-1,-1,-1,-1,-1,-1,9,9,0,1,8,4,7,2,3,11,-1,-1,-1,-1,-1,-1,12,4,7,11,9,4,11,9,11,2,9,2,1,-1,-1,-1,9,3,10,1,3,11,10,7,8,4,-1,-1,-1,-1,-1,-1,12,1,11,10,1,4,11,1,0,4,7,11,4,-1,-1,-1,12,4,7,8,9,0,11,9,11,10,11,0,3,-1,-1,-1,9,4,7,11,4,11,9,9,11,10,-1,-1,-1,-1,-1,-1,3,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,9,5,4,0,8,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,0,5,4,1,5,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,8,5,4,8,3,5,3,1,5,-1,-1,-1,-1,-1,-1,6,1,2,10,9,5,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,8,1,2,10,4,9,5,-1,-1,-1,-1,-1,-1,9,5,2,10,5,4,2,4,0,2,-1,-1,-1,-1,-1,-1,12,2,10,5,3,2,5,3,5,4,3,4,8,-1,-1,-1,6,9,5,4,2,3,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,11,2,0,8,11,4,9,5,-1,-1,-1,-1,-1,-1,9,0,5,4,0,1,5,2,3,11,-1,-1,-1,-1,-1,-1,12,2,1,5,2,5,8,2,8,11,4,8,5,-1,-1,-1,9,10,3,11,10,1,3,9,5,4,-1,-1,-1,-1,-1,-1,12,4,9,5,0,8,1,8,10,1,8,11,10,-1,-1,-1,12,5,4,0,5,0,11,5,11,10,11,0,3,-1,-1,-1,9,5,4,8,5,8,10,10,8,11,-1,-1,-1,-1,-1,-1,6,9,7,8,5,7,9,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,9,3,0,9,5,3,5,7,3,-1,-1,-1,-1,-1,-1,9,0,7,8,0,1,7,1,5,7,-1,-1,-1,-1,-1,-1,6,1,5,3,3,5,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,9,7,8,9,5,7,10,1,2,-1,-1,-1,-1,-1,-1,12,10,1,2,9,5,0,5,3,0,5,7,3,-1,-1,-1,12,8,0,2,8,2,5,8,5,7,10,5,2,-1,-1,-1,9,2,10,5,2,5,3,3,5,7,-1,-1,-1,-1,-1,-1,9,7,9,5,7,8,9,3,11,2,-1,-1,-1,-1,-1,-1,12,9,5,7,9,7,2,9,2,0,2,7,11,-1,-1,-1,12,2,3,11,0,1,8,1,7,8,1,5,7,-1,-1,-1,9,11,2,1,11,1,7,7,1,5,-1,-1,-1,-1,-1,-1,12,9,5,8,8,5,7,10,1,3,10,3,11,-1,-1,-1,15,5,7,0,5,0,9,7,11,0,1,0,10,11,10,0,15,11,10,0,11,0,3,10,5,0,8,0,7,5,7,0,6,11,10,5,7,11,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,0,8,3,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,9,0,1,5,10,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,1,8,3,1,9,8,5,10,6,-1,-1,-1,-1,-1,-1,6,1,6,5,2,6,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,1,6,5,1,2,6,3,0,8,-1,-1,-1,-1,-1,-1,9,9,6,5,9,0,6,0,2,6,-1,-1,-1,-1,-1,-1,12,5,9,8,5,8,2,5,2,6,3,2,8,-1,-1,-1,6,2,3,11,10,6,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,11,0,8,11,2,0,10,6,5,-1,-1,-1,-1,-1,-1,9,0,1,9,2,3,11,5,10,6,-1,-1,-1,-1,-1,-1,12,5,10,6,1,9,2,9,11,2,9,8,11,-1,-1,-1,9,6,3,11,6,5,3,5,1,3,-1,-1,-1,-1,-1,-1,12,0,8,11,0,11,5,0,5,1,5,11,6,-1,-1,-1,12,3,11,6,0,3,6,0,6,5,0,5,9,-1,-1,-1,9,6,5,9,6,9,11,11,9,8,-1,-1,-1,-1,-1,-1,6,5,10,6,4,7,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,4,3,0,4,7,3,6,5,10,-1,-1,-1,-1,-1,-1,9,1,9,0,5,10,6,8,4,7,-1,-1,-1,-1,-1,-1,12,10,6,5,1,9,7,1,7,3,7,9,4,-1,-1,-1,9,6,1,2,6,5,1,4,7,8,-1,-1,-1,-1,-1,-1,12,1,2,5,5,2,6,3,0,4,3,4,7,-1,-1,-1,12,8,4,7,9,0,5,0,6,5,0,2,6,-1,-1,-1,15,7,3,9,7,9,4,3,2,9,5,9,6,2,6,9,9,3,11,2,7,8,4,10,6,5,-1,-1,-1,-1,-1,-1,12,5,10,6,4,7,2,4,2,0,2,7,11,-1,-1,-1,12,0,1,9,4,7,8,2,3,11,5,10,6,-1,-1,-1,15,9,2,1,9,11,2,9,4,11,7,11,4,5,10,6,12,8,4,7,3,11,5,3,5,1,5,11,6,-1,-1,-1,15,5,1,11,5,11,6,1,0,11,7,11,4,0,4,11,15,0,5,9,0,6,5,0,3,6,11,6,3,8,4,7,12,6,5,9,6,9,11,4,7,9,7,11,9,-1,-1,-1,6,10,4,9,6,4,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,4,10,6,4,9,10,0,8,3,-1,-1,-1,-1,-1,-1,9,10,0,1,10,6,0,6,4,0,-1,-1,-1,-1,-1,-1,12,8,3,1,8,1,6,8,6,4,6,1,10,-1,-1,-1,9,1,4,9,1,2,4,2,6,4,-1,-1,-1,-1,-1,-1,12,3,0,8,1,2,9,2,4,9,2,6,4,-1,-1,-1,6,0,2,4,4,2,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,8,3,2,8,2,4,4,2,6,-1,-1,-1,-1,-1,-1,9,10,4,9,10,6,4,11,2,3,-1,-1,-1,-1,-1,-1,12,0,8,2,2,8,11,4,9,10,4,10,6,-1,-1,-1,12,3,11,2,0,1,6,0,6,4,6,1,10,-1,-1,-1,15,6,4,1,6,1,10,4,8,1,2,1,11,8,11,1,12,9,6,4,9,3,6,9,1,3,11,6,3,-1,-1,-1,15,8,11,1,8,1,0,11,6,1,9,1,4,6,4,1,9,3,11,6,3,6,0,0,6,4,-1,-1,-1,-1,-1,-1,6,6,4,8,11,6,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,10,6,7,8,10,8,9,10,-1,-1,-1,-1,-1,-1,12,0,7,3,0,10,7,0,9,10,6,7,10,-1,-1,-1,12,10,6,7,1,10,7,1,7,8,1,8,0,-1,-1,-1,9,10,6,7,10,7,1,1,7,3,-1,-1,-1,-1,-1,-1,12,1,2,6,1,6,8,1,8,9,8,6,7,-1,-1,-1,15,2,6,9,2,9,1,6,7,9,0,9,3,7,3,9,9,7,8,0,7,0,6,6,0,2,-1,-1,-1,-1,-1,-1,6,7,3,2,6,7,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,2,3,11,10,6,8,10,8,9,8,6,7,-1,-1,-1,15,2,0,7,2,7,11,0,9,7,6,7,10,9,10,7,15,1,8,0,1,7,8,1,10,7,6,7,10,2,3,11,12,11,2,1,11,1,7,10,6,1,6,7,1,-1,-1,-1,15,8,9,6,8,6,7,9,1,6,11,6,3,1,3,6,6,0,9,1,11,6,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,7,8,0,7,0,6,3,11,0,11,6,0,-1,-1,-1,3,7,11,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,3,0,8,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,0,1,9,11,7,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,8,1,9,8,3,1,11,7,6,-1,-1,-1,-1,-1,-1,6,10,1,2,6,11,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,1,2,10,3,0,8,6,11,7,-1,-1,-1,-1,-1,-1,9,2,9,0,2,10,9,6,11,7,-1,-1,-1,-1,-1,-1,12,6,11,7,2,10,3,10,8,3,10,9,8,-1,-1,-1,6,7,2,3,6,2,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,7,0,8,7,6,0,6,2,0,-1,-1,-1,-1,-1,-1,9,2,7,6,2,3,7,0,1,9,-1,-1,-1,-1,-1,-1,12,1,6,2,1,8,6,1,9,8,8,7,6,-1,-1,-1,9,10,7,6,10,1,7,1,3,7,-1,-1,-1,-1,-1,-1,12,10,7,6,1,7,10,1,8,7,1,0,8,-1,-1,-1,12,0,3,7,0,7,10,0,10,9,6,10,7,-1,-1,-1,9,7,6,10,7,10,8,8,10,9,-1,-1,-1,-1,-1,-1,6,6,8,4,11,8,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,6,11,3,0,6,0,4,6,-1,-1,-1,-1,-1,-1,9,8,6,11,8,4,6,9,0,1,-1,-1,-1,-1,-1,-1,12,9,4,6,9,6,3,9,3,1,11,3,6,-1,-1,-1,9,6,8,4,6,11,8,2,10,1,-1,-1,-1,-1,-1,-1,12,1,2,10,3,0,11,0,6,11,0,4,6,-1,-1,-1,12,4,11,8,4,6,11,0,2,9,2,10,9,-1,-1,-1,15,10,9,3,10,3,2,9,4,3,11,3,6,4,6,3,9,8,2,3,8,4,2,4,6,2,-1,-1,-1,-1,-1,-1,6,0,4,2,4,6,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,1,9,0,2,3,4,2,4,6,4,3,8,-1,-1,-1,9,1,9,4,1,4,2,2,4,6,-1,-1,-1,-1,-1,-1,12,8,1,3,8,6,1,8,4,6,6,10,1,-1,-1,-1,9,10,1,0,10,0,6,6,0,4,-1,-1,-1,-1,-1,-1,15,4,6,3,4,3,8,6,10,3,0,3,9,10,9,3,6,10,9,4,6,10,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,4,9,5,7,6,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,8,3,4,9,5,11,7,6,-1,-1,-1,-1,-1,-1,9,5,0,1,5,4,0,7,6,11,-1,-1,-1,-1,-1,-1,12,11,7,6,8,3,4,3,5,4,3,1,5,-1,-1,-1,9,9,5,4,10,1,2,7,6,11,-1,-1,-1,-1,-1,-1,12,6,11,7,1,2,10,0,8,3,4,9,5,-1,-1,-1,12,7,6,11,5,4,10,4,2,10,4,0,2,-1,-1,-1,15,3,4,8,3,5,4,3,2,5,10,5,2,11,7,6,9,7,2,3,7,6,2,5,4,9,-1,-1,-1,-1,-1,-1,12,9,5,4,0,8,6,0,6,2,6,8,7,-1,-1,-1,12,3,6,2,3,7,6,1,5,0,5,4,0,-1,-1,-1,15,6,2,8,6,8,7,2,1,8,4,8,5,1,5,8,12,9,5,4,10,1,6,1,7,6,1,3,7,-1,-1,-1,15,1,6,10,1,7,6,1,0,7,8,7,0,9,5,4,15,4,0,10,4,10,5,0,3,10,6,10,7,3,7,10,12,7,6,10,7,10,8,5,4,10,4,8,10,-1,-1,-1,9,6,9,5,6,11,9,11,8,9,-1,-1,-1,-1,-1,-1,12,3,6,11,0,6,3,0,5,6,0,9,5,-1,-1,-1,12,0,11,8,0,5,11,0,1,5,5,6,11,-1,-1,-1,9,6,11,3,6,3,5,5,3,1,-1,-1,-1,-1,-1,-1,12,1,2,10,9,5,11,9,11,8,11,5,6,-1,-1,-1,15,0,11,3,0,6,11,0,9,6,5,6,9,1,2,10,15,11,8,5,11,5,6,8,0,5,10,5,2,0,2,5,12,6,11,3,6,3,5,2,10,3,10,5,3,-1,-1,-1,12,5,8,9,5,2,8,5,6,2,3,8,2,-1,-1,-1,9,9,5,6,9,6,0,0,6,2,-1,-1,-1,-1,-1,-1,15,1,5,8,1,8,0,5,6,8,3,8,2,6,2,8,6,1,5,6,2,1,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,15,1,3,6,1,6,10,3,8,6,5,6,9,8,9,6,12,10,1,0,10,0,6,9,5,0,5,6,0,-1,-1,-1,6,0,3,8,5,6,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,10,5,6,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,11,5,10,7,5,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,11,5,10,11,7,5,8,3,0,-1,-1,-1,-1,-1,-1,9,5,11,7,5,10,11,1,9,0,-1,-1,-1,-1,-1,-1,12,10,7,5,10,11,7,9,8,1,8,3,1,-1,-1,-1,9,11,1,2,11,7,1,7,5,1,-1,-1,-1,-1,-1,-1,12,0,8,3,1,2,7,1,7,5,7,2,11,-1,-1,-1,12,9,7,5,9,2,7,9,0,2,2,11,7,-1,-1,-1,15,7,5,2,7,2,11,5,9,2,3,2,8,9,8,2,9,2,5,10,2,3,5,3,7,5,-1,-1,-1,-1,-1,-1,12,8,2,0,8,5,2,8,7,5,10,2,5,-1,-1,-1,12,9,0,1,5,10,3,5,3,7,3,10,2,-1,-1,-1,15,9,8,2,9,2,1,8,7,2,10,2,5,7,5,2,6,1,3,5,3,7,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,0,8,7,0,7,1,1,7,5,-1,-1,-1,-1,-1,-1,9,9,0,3,9,3,5,5,3,7,-1,-1,-1,-1,-1,-1,6,9,8,7,5,9,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,5,8,4,5,10,8,10,11,8,-1,-1,-1,-1,-1,-1,12,5,0,4,5,11,0,5,10,11,11,3,0,-1,-1,-1,12,0,1,9,8,4,10,8,10,11,10,4,5,-1,-1,-1,15,10,11,4,10,4,5,11,3,4,9,4,1,3,1,4,12,2,5,1,2,8,5,2,11,8,4,5,8,-1,-1,-1,15,0,4,11,0,11,3,4,5,11,2,11,1,5,1,11,15,0,2,5,0,5,9,2,11,5,4,5,8,11,8,5,6,9,4,5,2,11,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,2,5,10,3,5,2,3,4,5,3,8,4,-1,-1,-1,9,5,10,2,5,2,4,4,2,0,-1,-1,-1,-1,-1,-1,15,3,10,2,3,5,10,3,8,5,4,5,8,0,1,9,12,5,10,2,5,2,4,1,9,2,9,4,2,-1,-1,-1,9,8,4,5,8,5,3,3,5,1,-1,-1,-1,-1,-1,-1,6,0,4,5,1,0,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,8,4,5,8,5,3,9,0,5,0,3,5,-1,-1,-1,3,9,4,5,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,4,11,7,4,9,11,9,10,11,-1,-1,-1,-1,-1,-1,12,0,8,3,4,9,7,9,11,7,9,10,11,-1,-1,-1,12,1,10,11,1,11,4,1,4,0,7,4,11,-1,-1,-1,15,3,1,4,3,4,8,1,10,4,7,4,11,10,11,4,12,4,11,7,9,11,4,9,2,11,9,1,2,-1,-1,-1,15,9,7,4,9,11,7,9,1,11,2,11,1,0,8,3,9,11,7,4,11,4,2,2,4,0,-1,-1,-1,-1,-1,-1,12,11,7,4,11,4,2,8,3,4,3,2,4,-1,-1,-1,12,2,9,10,2,7,9,2,3,7,7,4,9,-1,-1,-1,15,9,10,7,9,7,4,10,2,7,8,7,0,2,0,7,15,3,7,10,3,10,2,7,4,10,1,10,0,4,0,10,6,1,10,2,8,7,4,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,4,9,1,4,1,7,7,1,3,-1,-1,-1,-1,-1,-1,12,4,9,1,4,1,7,0,8,1,8,7,1,-1,-1,-1,6,4,0,3,7,4,3,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,4,8,7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,9,10,8,10,11,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,3,0,9,3,9,11,11,9,10,-1,-1,-1,-1,-1,-1,9,0,1,10,0,10,8,8,10,11,-1,-1,-1,-1,-1,-1,6,3,1,10,11,3,10,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,1,2,11,1,11,9,9,11,8,-1,-1,-1,-1,-1,-1,12,3,0,9,3,9,11,1,2,9,2,11,9,-1,-1,-1,6,0,2,11,8,0,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,3,2,11,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,9,2,3,8,2,8,10,10,8,9,-1,-1,-1,-1,-1,-1,6,9,10,2,0,9,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,12,2,3,8,2,8,10,0,1,8,1,10,8,-1,-1,-1,3,1,10,2,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,6,1,3,8,9,1,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,9,1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,3,0,3,8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]);var eo={xMin:-1,xMax:1,xStep:.1,yMin:-1,yMax:1,yStep:.1,zMin:-1,zMax:1,zStep:.1},Kt=class extends j{constructor(t={},i=1){super(),this.volume=Object.assign({},eo,t),this.volume.width=Math.floor((this.volume.xMax-this.volume.xMin)/this.volume.xStep)+1,this.volume.height=Math.floor((this.volume.yMax-this.volume.yMin)/this.volume.yStep)+1,this.volume.depth=Math.floor((this.volume.zMax-this.volume.zMin)/this.volume.zStep)+1,this.volume.values=new Float32Array(this.volume.width*this.volume.height*this.volume.depth),this.valueCache=new Float32Array(8),this.normalCache=new Float32Array(24),this.TMP_VEC3_A=x.create(),this.TMP_VEC3_B=x.create(),this.indexList=new Uint16Array(12),this.uvScale=i}updateVolume(t){let i=this.volume,r=i.values,n=0;for(let s=0;s<i.depth;++s){let o=i.zMin+i.zStep*s;for(let a=0;a<i.height;++a){let l=i.yMin+i.yStep*a;for(let c=0;c<i.width;++c){let h=i.xMin+i.xStep*c;r[n++]=t.surfaceFunc(h,l,o)}}}}valueAt(t,i,r){let n=this.volume,s=t+i*n.width+r*n.width*n.height;return n.values[s]}generateMesh(t=40){this.positions=[],this.normals=[],this.uvs=[],this.colors=[],this.move=[],this.vertices=[],this.edges=[],this.faces=[],this.indices=[];let i=0,r=this.volume;for(let n=0;n<r.depth-1;++n)for(let s=0;s<r.height-1;++s)for(let o=0;o<r.width-1;++o){let a=this.marchingCube(o,s,n,t);i+=a}return i}marchingCube(t,i,r,n){let s=this.volume,o=s.xMin+s.xStep*t,a=s.yMin+s.yStep*i,l=s.zMin+s.zStep*r,c=this.valueCache;c[0]=this.valueAt(t,i,r),c[1]=this.valueAt(t+1,i,r),c[2]=this.valueAt(t+1,i+1,r),c[3]=this.valueAt(t,i+1,r),c[4]=this.valueAt(t,i,r+1),c[5]=this.valueAt(t+1,i,r+1),c[6]=this.valueAt(t+1,i+1,r+1),c[7]=this.valueAt(t,i+1,r+1);let h=0;c[0]<n&&(h|=1),c[1]<n&&(h|=2),c[2]<n&&(h|=4),c[3]<n&&(h|=8),c[4]<n&&(h|=16),c[5]<n&&(h|=32),c[6]<n&&(h|=64),c[7]<n&&(h|=128);let f=Bi[h];if(f===0)return 0;let d=[];if(f&1){let[p,v]=this.interpX(n,t,i,r,c[0],c[1]);this.indexList[0]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[0])}if(f&2){let[p,v]=this.interpY(n,t+1,i,r,c[1],c[2]);this.indexList[1]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[1])}if(f&4){let[p,v]=this.interpX(n,t,i+1,r,c[3],c[2]);this.indexList[2]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[2])}if(f&8){let[p,v]=this.interpY(n,t,i,r,c[0],c[3]);this.indexList[3]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[3])}if(f&16){let[p,v]=this.interpX(n,t,i,r+1,c[4],c[5]);this.indexList[4]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[4])}if(f&32){let[p,v]=this.interpY(n,t+1,i,r+1,c[5],c[6]);this.indexList[5]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[5])}if(f&64){let[p,v]=this.interpX(n,t,i+1,r+1,c[7],c[6]);this.indexList[6]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[6])}if(f&128){let[p,v]=this.interpY(n,t,i,r+1,c[4],c[7]);this.indexList[7]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[7])}if(f&256){let[p,v]=this.interpZ(n,t,i,r,c[0],c[4]);this.indexList[8]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[8])}if(f&512){let[p,v]=this.interpZ(n,t+1,i,r,c[1],c[5]);this.indexList[9]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[9])}if(f&1024){let[p,v]=this.interpZ(n,t+1,i+1,r,c[2],c[6]);this.indexList[10]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[10])}if(f&2048){let[p,v]=this.interpZ(n,t,i+1,r,c[3],c[7]);this.indexList[11]=this.addVertex(p,v,[0,0],[1,1,1,1],0),d.push(this.indexList[11])}let u=h<<4,m=Dt[u++],g=0;for(let p=0;p<m;p+=3){let v=Dt[u++],A=Dt[u++],y=Dt[u++];this.addFace([this.indexList[v],this.indexList[A],this.indexList[y]]),g++}return this.generateEdges(),this.computeUVs(),g}addEdge(t,i){let r={vertices:[t,i],faces:[]},n=this.edges.length;return this.edges.push(r),this.vertices[t].edges.push(n),this.vertices[i].edges.push(n),n}generateEdges(){this.edges=[];let t=new Set,i=[];for(let r of this.faces){let n=r.vertices;for(let s=0;s<n.length;s++){let o=n[s],a=n[(s+1)%n.length],l=Math.min(o,a),c=Math.max(o,a),h=`${l}-${c}`;t.has(h)||(t.add(h),i.push(l,c),this.addEdge(l,c))}}this.edges=i}interpX(t,i,r,n,s,o){let a=this.volume,l=(t-s)/(o-s),c=[a.xMin+a.xStep*i+l*a.xStep,a.yMin+a.yStep*r,a.zMin+a.zStep*n];return this.computeNormal(this.TMP_VEC3_A,i,r,n),this.computeNormal(this.TMP_VEC3_B,i+1,r,n),x.lerp(this.TMP_VEC3_A,this.TMP_VEC3_A,this.TMP_VEC3_B,l),[c,Array.from(this.TMP_VEC3_A)]}interpY(t,i,r,n,s,o){let a=this.volume,l=(t-s)/(o-s),c=[a.xMin+a.xStep*i,a.yMin+a.yStep*r+l*a.yStep,a.zMin+a.zStep*n];return this.computeNormal(this.TMP_VEC3_A,i,r,n),this.computeNormal(this.TMP_VEC3_B,i,r+1,n),x.lerp(this.TMP_VEC3_A,this.TMP_VEC3_A,this.TMP_VEC3_B,l),[c,Array.from(this.TMP_VEC3_A)]}interpZ(t,i,r,n,s,o){let a=this.volume,l=(t-s)/(o-s),c=[a.xMin+a.xStep*i,a.yMin+a.yStep*r,a.zMin+a.zStep*n+l*a.zStep];return this.computeNormal(this.TMP_VEC3_A,i,r,n),this.computeNormal(this.TMP_VEC3_B,i,r,n+1),x.lerp(this.TMP_VEC3_A,this.TMP_VEC3_A,this.TMP_VEC3_B,l),[c,Array.from(this.TMP_VEC3_A)]}computeNormal(t,i,r,n){let s=this.volume,o=Math.max(0,i-1),a=Math.min(s.width-1,i+1),l=Math.max(0,r-1),c=Math.min(s.height-1,r+1),h=Math.max(0,n-1),f=Math.min(s.depth-1,n+1);t[0]=this.valueAt(o,r,n)-this.valueAt(a,r,n),t[1]=this.valueAt(i,l,n)-this.valueAt(i,c,n),t[2]=this.valueAt(i,r,h)-this.valueAt(i,r,f);let d=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);d>0&&(t[0]/=d,t[1]/=d,t[2]/=d)}computeUVs(){let t=1/0,i=-1/0,r=1/0,n=-1/0,s=1/0,o=-1/0;for(let p=0;p<this.positions.length;p+=3){let v=this.positions[p],A=this.positions[p+1],y=this.positions[p+2];t=Math.min(t,v),i=Math.max(i,v),r=Math.min(r,A),n=Math.max(n,A),s=Math.min(s,y),o=Math.max(o,y)}let a=i-t,l=n-r,c=o-s,h,f,d,u,m,g;a>=l&&a>=c?l>=c?(h=0,f=1,d=a,u=l,m=t,g=r):(h=0,f=2,d=a,u=c,m=t,g=s):l>=c?(h=1,f=2,d=l,u=c,m=r,g=s):(h=0,f=2,d=a,u=c,m=t,g=s);for(let p=0;p<this.vertices.length;p++){let v=this.vertices[p],A=v.position,y=d>0?(A[h]-m)/d:0,M=u>0?(A[f]-g)/u:0;v.uv=[y,M],this.uvs[p*2]=y*this.uvScale,this.uvs[p*2+1]=M*this.uvScale}}};var Qt=class{constructor(t=[0,-1,0],i=[1,1,1],r=1){this.direction=x.fromValues(...t),x.normalize(this.direction,this.direction),this.color=x.fromValues(...i),this.intensity=r,this.castShadow=!1,this.shadowMapSize=2048,this.shadowBias=-.006,this.shadowCamera={left:-10,right:10,bottom:-10,top:10,near:.5,far:50,position:x.create(),target:x.fromValues(0,0,0),up:x.fromValues(0,1,0)},this.projectionMatrix=D.create(),this.viewMatrix=D.create(),this.lightSpaceMatrix=D.create(),this.modelMatrix=D.create(),this.updateMatrices()}setDirection(t,i,r){x.set(this.direction,t,i,r),x.normalize(this.direction,this.direction),this.updateMatrices()}setShadowCamera(t,i){x.copy(this.shadowCamera.position,t),x.copy(this.shadowCamera.target,i),x.subtract(this.direction,i,t),x.normalize(this.direction,this.direction),this.updateMatrices()}setShadowCameraBounds(t,i,r,n,s,o){this.shadowCamera.left=t,this.shadowCamera.right=i,this.shadowCamera.bottom=r,this.shadowCamera.top=n,this.shadowCamera.near=s,this.shadowCamera.far=o,this.updateMatrices()}updateMatrices(){D.ortho(this.projectionMatrix,this.shadowCamera.left,this.shadowCamera.right,this.shadowCamera.bottom,this.shadowCamera.top,this.shadowCamera.near,this.shadowCamera.far),D.lookAt(this.viewMatrix,this.shadowCamera.position,this.shadowCamera.target,this.shadowCamera.up),D.multiply(this.lightSpaceMatrix,this.projectionMatrix,this.viewMatrix)}getReversedDirection(){let t=x.create();return x.negate(t,this.direction),t}};var io={BURGUNDY:[145,78,114],BLUE:[0,120,191],GREEN:[0,169,92],MED_BLUE:[50,85,164],BRIGHT_RED:[241,80,96],FED_BLUE:[61,85,136],TEAL:[0,131,138],ORANGE:[255,108,47],LIGHT_GRAY:[136,137,138],YELLOW:[255,232,0],CRIMSON:[228,93,80],CORNFLOWER:[98,168,229],SKYBLUE:[73,130,207],SEABLUE:[0,116,162],INDIGO:[72,77,122],MIDNIGHT:[67,80,96],MIST:[184,199,196],STEEL:[55,95,119],SEAFOAM:[98,194,177],LAGOON:[47,97,101],PLUM:[132,89,145],GRAPE:[108,93,128],TOMATO:[210,81,94],SUNFLOWER:[255,181,17],MELON:[255,174,59],APRICOT:[246,160,77],PAPRIKA:[238,127,75],MAHOGANY:[142,89,90],BISQUE:[242,205,207],WINE:[145,78,114]};function ro(e,t){let i=Object.values(io),r=[],n=Fi(i,t);for(let s=0;s<e;s++)r.push(n[s][0],n[s][1],n[s][2]);return r=r.map(s=>s/255),r}var Vi=ro;var we=class{constructor(t,i,r){this.index=t,this.maxNum=i,this.target=r,this.current=0,this.delay=t,this.frame=0,this.flipSpeed=3,this.position=[0,0],this.static=!1}setTarget(t){this.target=Math.max(0,Math.min(t,this.maxNum-1))}setDelay(t){this.delay=Math.max(0,t)}setRandom(){this.current=Math.floor(Math.random()*this.maxNum)}flip(){if(this.delay>0){this.delay-=1;return}if(this.current!==this.target&&this.static==!1){let t=(this.target-this.current+this.maxNum)%this.maxNum,i=(this.current-this.target+this.maxNum)%this.maxNum,r;t<=i?r=(this.current+Math.min(this.flipSpeed,t))%this.maxNum:r=(this.current-Math.min(this.flipSpeed,i)+this.maxNum)%this.maxNum;let n=(this.target-r+this.maxNum)%this.maxNum,s=(r-this.target+this.maxNum)%this.maxNum;Math.min(n,s)<=Math.min(t,i)?this.current=r:this.current=this.target}}update(){return this.frame+=1,this.current}},Li=we;var Pe=class{constructor(t,i,r){this.cellW=i,this.cellH=r,this.cols=Math.floor(t.width/i),this.rows=Math.floor(t.height/r),this.instances=[]}get cx(){return Math.floor(this.cols/2)}get cy(){return Math.floor(this.rows/2)}fromRight(t){return this.cols-1-t}fromBottom(t){return this.rows-1-t}colAt(t){return Math.floor(this.cols*t)}rowAt(t){return Math.floor(this.rows*t)}gridToWorld(t,i){return{x:t*this.cellW+this.cellW/2,y:i*this.cellH+this.cellH/2}}putChar(t,i,r=0,n=[1,1,1,1],s){let o=this.gridToWorld(t,i);this.instances.push({...o,char:r,color:n,col:t,row:i,still:s})}setChar(t,i,r,n){let s=this.instances.find(o=>o.col===t&&o.row===i);return s?(s.char=r,n&&(s.color=n),!0):!1}setCharAt(t,i,r){return t>=0&&t<this.instances.length?(this.instances[t].char=i,r&&(this.instances[t].color=r),!0):!1}setTextAt(t,i,r,n){for(let s=0;s<r.length;s++)this.setChar(t+s,i,r.charCodeAt(s),n)}hLine(t,i,r,n=45,s=[1,1,1,1],o){for(let a=0;a<r;a++)this.putChar(t+a,i,n,s,o)}vLine(t,i,r,n=124,s=[1,1,1,1],o){for(let a=0;a<r;a++)this.putChar(t,i+a,n,s,o)}line(t,i,r,n,s=42,o=[1,1,1,1],a){let l=Math.round(t),c=Math.round(i),h=Math.round(r),f=Math.round(n),d=Math.abs(h-l),u=Math.abs(f-c),m=l<h?1:-1,g=c<f?1:-1,p=d-u;for(;this.putChar(l,c,s,o,a),!(l===h&&c===f);){let v=2*p;v>-u&&(p-=u,l+=m),v<d&&(p+=d,c+=g)}}polyline(t,i=42,r=[1,1,1,1],n=!1,s){if(!(t.length<2)){for(let o=0;o<t.length-1;o++){let a=t[o],l=t[o+1];this.line(a[0],a[1],l[0],l[1],i,r,s)}if(n&&t.length>2){let o=t[0],a=t[t.length-1];this.line(a[0],a[1],o[0],o[1],i,r,s)}}}polygon(t,i,r,n,s=0,o=42,a=[1,1,1,1],l=!0,c){let h=[];for(let f=0;f<n;f++){let d=s+f/n*Math.PI*2;h.push([Math.round(t+Math.cos(d)*r),Math.round(i+Math.sin(d)*r)])}this.polyline(h,o,a,l,c)}box(t,i,r,n,s=[1,1,1,1],o){this.putChar(t,i,43,s,o),this.putChar(t+r-1,i,43,s,o),this.putChar(t,i+n-1,43,s,o),this.putChar(t+r-1,i+n-1,43,s,o),this.hLine(t+1,i,r-2,45,s,o),this.hLine(t+1,i+n-1,r-2,45,s,o),this.vLine(t,i+1,n-2,124,s,o),this.vLine(t+r-1,i+1,n-2,124,s,o)}fillRect(t,i,r,n,s=35,o=[1,1,1,1],a){for(let l=0;l<n;l++)for(let c=0;c<r;c++)this.putChar(t+c,i+l,s,o,a)}text(t,i,r,n=[1,1,1,1],s){for(let o=0;o<r.length;o++)this.putChar(t+o,i,r.charCodeAt(o),n,s)}crosshair(t,i,r,n=[1,1,1,1],s){for(let o=1;o<=r;o++)this.putChar(t-o,i,45,n,s),this.putChar(t+o,i,45,n,s);for(let o=1;o<=r;o++)this.putChar(t,i-o,124,n,s),this.putChar(t,i+o,124,n,s);this.putChar(t,i,43,n,s)}circle(t,i,r,n=42,s=[1,1,1,1],o){let a=r,l=0,c=1-r,h=(f,d)=>{this.putChar(t+f,i+d,n,s,o),this.putChar(t-f,i+d,n,s,o),this.putChar(t+f,i-d,n,s,o),this.putChar(t-f,i-d,n,s,o),this.putChar(t+d,i+f,n,s,o),this.putChar(t-d,i+f,n,s,o),this.putChar(t+d,i-f,n,s,o),this.putChar(t-d,i-f,n,s,o)};for(;a>=l;)h(a,l),l++,c<0?c+=2*l+1:(a--,c+=2*(l-a)+1)}ticks(t,i,r,n,s=!1,o=[1,1,1,1],a){for(let l=0;l<r;l++)s?this.putChar(t,i+l*n,45,o,a):this.putChar(t+l*n,i,124,o,a)}arc(t,i,r,n,s,o=16,a=46,l=[1,1,1,1],c){for(let h=0;h<=o;h++){let f=h/o,d=n+f*(s-n),u=Math.round(t+Math.cos(d)*r),m=Math.round(i+Math.sin(d)*r);this.putChar(u,m,a,l,c)}}bracket(t,i,r,n,s,o,a){let l=s[1]==="l"?t:t+r-1,c=s[0]==="t"?i:i+n-1,h=s[1]==="l"?1:-1,f=s[0]==="t"?1:-1;this.putChar(l,c,43,o,a);for(let d=1;d<r;d++)this.putChar(l+d*h,c,45,o,a);for(let d=1;d<n;d++)this.putChar(l,c+d*f,124,o,a)}},Ui=Pe;var Jt=class{constructor(t,i=0,r=[0,0,-1]){this.target=t,this.instanceIndex=i,this.bounds=null,this.position=t.getInstance(0).position,this.rotation=b.create(),this.velocity=x.create(),this.angularVelocity=x.create(),this.maxSpeed=20,this.linearDamping=.92,this.angularDamping=.88,this.stabilizeStrength=3,this.moveAccel=20,this.rotateAccel=5,this.forward=x.create(),this.right=x.create(),this.up=x.fromValues(0,1,0),this.baseForward=x.create(),this.baseRight=x.create(),this.baseUp=x.fromValues(0,1,0),this.setHeading(r),this.forces=[],this.mass=1,this.obstacles=[],this.avoidanceRadius=0,this.avoidanceStrength=0,this.heightField=null,this.heightFieldClearance=2,this.normalAlignStrength=3,this.normalAlignBlend=.05,this.lookAtTarget=null,this.lookAtSpeed=2,this.rollFromFace=0,this.faceRollStrength=9,this.faceRollDeadzone=.02,this.keys={},this.keyPressed=!1,this.onKeyDown=this.onKeyDown.bind(this),this.onKeyUp=this.onKeyUp.bind(this),window.addEventListener("keydown",this.onKeyDown),window.addEventListener("keyup",this.onKeyUp)}async initPoseNet(){let t=document.createElement("video");t.width=320,t.height=240,t.autoplay=!0,t.style.display="none",document.body.appendChild(t),this.poseVideo=t;let i=await navigator.mediaDevices.getUserMedia({video:{width:320,height:240}});t.srcObject=i,await new Promise(r=>t.addEventListener("loadeddata",r)),this.poseNet=await posenet.load(),this.poseTrackingActive=!0,this._poseLoop()}async _poseLoop(){for(;this.poseTrackingActive;){if(this.poseVideo.readyState>=2){let t=await this.poseNet.estimateSinglePose(this.poseVideo,{flipHorizontal:!0}),i=t.keypoints[1],r=t.keypoints[2];if(i.score>.5&&r.score>.5){let n=r.position.x-i.position.x,s=r.position.y-i.position.y;this.rollFromFace=Math.atan2(s,n)}}await new Promise(t=>setTimeout(t,80))}}setBounds(t,i){this.bounds={min:x.fromValues(t[0],t[1],t[2]),max:x.fromValues(i[0],i[1],i[2])}}setHeading(t){x.normalize(this.baseForward,t),x.cross(this.baseRight,this.baseForward,this.baseUp),x.normalize(this.baseRight,this.baseRight),x.copy(this.forward,this.baseForward),x.copy(this.right,this.baseRight),x.copy(this.up,this.baseUp)}setHeightField(t,i=2,r=3){this.heightField=t,this.heightFieldClearance=i,this.normalAlignStrength=r}onKeyDown(t){this.keys[t.key.toLowerCase()]=!0;let i=["w","s","e","q"];this.keyPressed=i.some(r=>this.keys[r]===!0)}onKeyUp(t){this.keys[t.key.toLowerCase()]=!1;let i=["w","s","e","q"];this.keyPressed=i.some(r=>this.keys[r]===!0)}addForce(t){this.forces.push(x.clone(t))}clearForces(){this.forces=[]}addAttractionForce(t,i=1,r=2){let n=x.create();x.subtract(n,this.position,t);let s=x.length(n);if(s<1e-4)return;let o=s-r,a=x.create();x.normalize(a,n),x.scale(a,a,-o*i),this.addForce(a)}addRepulsionForce(t,i=1,r=5){let n=x.create();x.subtract(n,this.position,t);let s=x.length(n);if(s>.001&&s<r){x.normalize(n,n);let o=1-s/r;x.scale(n,n,i*o),this.addForce(n)}}setLookAtTarget(t){t?this.lookAtTarget=x.clone(t):this.lookAtTarget=null}setObstacles(t){this.obstacles=t.map(i=>Array.isArray(i)?x.fromValues(i[0],i[1],i[2]):x.clone(i))}addObstacle(t){let i=Array.isArray(t)?x.fromValues(t[0],t[1],t[2]):x.clone(t);this.obstacles.push(i)}clearObstacles(){this.obstacles=[]}update(t){let i=this.moveAccel*t,r=this.rotateAccel*t;if(this.keys.arrowleft&&(this.angularVelocity[0]+=r),this.keys.arrowright&&(this.angularVelocity[0]-=r),this.keys.arrowup&&(this.angularVelocity[1]-=r),this.keys.arrowdown&&(this.angularVelocity[1]+=r),this.keys.d&&(this.angularVelocity[2]+=r),this.keys.a&&(this.angularVelocity[2]-=r),Math.abs(this.rollFromFace)>this.faceRollDeadzone&&(this.angularVelocity[2]+=this.rollFromFace*this.faceRollStrength*t),this.angularVelocity[0]!==0&&this.rotateYaw(this.angularVelocity[0]*t),this.angularVelocity[1]!==0&&this.rotatePitch(this.angularVelocity[1]*t),this.angularVelocity[2]!==0&&this.rotateRoll(this.angularVelocity[2]*t),x.scale(this.angularVelocity,this.angularVelocity,this.angularDamping),!this.keyPressed){let s=this.right[1];this.angularVelocity[2]+=s*this.stabilizeStrength*t}if(this.lookAtTarget&&this.keyPressed==!1){let s=x.create();if(x.subtract(s,this.lookAtTarget,this.position),x.length(s)>.001){x.normalize(s,s);let a=x.create();if(x.cross(a,this.forward,s),x.length(a)>.001){x.normalize(a,a);let c=Math.acos(Math.max(-1,Math.min(1,x.dot(this.forward,s)))),h=Math.min(c,this.lookAtSpeed*t),f=b.create();b.setAxisAngle(f,a,h),b.multiply(this.rotation,f,this.rotation),b.normalize(this.rotation,this.rotation)}}}if(x.transformQuat(this.forward,this.baseForward,this.rotation),x.transformQuat(this.right,this.baseRight,this.rotation),x.transformQuat(this.up,this.baseUp,this.rotation),this.keys.w&&x.scaleAndAdd(this.velocity,this.velocity,this.forward,i),this.keys.s&&x.scaleAndAdd(this.velocity,this.velocity,this.forward,-i),this.keys.e&&x.scaleAndAdd(this.velocity,this.velocity,this.up,i),this.keys.q&&x.scaleAndAdd(this.velocity,this.velocity,this.up,-i),this.forces.length>0&&this.keyPressed==!1){let s=x.create();for(let o of this.forces)x.add(s,s,o);x.scaleAndAdd(this.velocity,this.velocity,s,t/this.mass),this.clearForces()}if(x.scaleAndAdd(this.position,this.position,this.velocity,t),this.heightField&&this.heightField.inBounds(this.position[0],this.position[2])){let o=this.heightField.getHeight(this.position[0],this.position[2])+this.heightFieldClearance;this.position[1]<o&&(this.position[1]=o,this.velocity[1]<0&&(this.velocity[1]*=-.2));let a=this.heightField.getNormal(this.position[0],this.position[2]),l=x.fromValues(a[0],a[1],a[2]),c=x.clone(this.up),h=x.create();if(x.cross(h,c,l),x.length(h)>.001){x.normalize(h,h);let u=Math.acos(Math.max(-1,Math.min(1,x.dot(c,l))))*this.normalAlignBlend*this.normalAlignStrength*t,m=b.create();b.setAxisAngle(m,h,u),b.multiply(this.rotation,m,this.rotation),b.normalize(this.rotation,this.rotation)}}if(this.bounds){let{min:s,max:o}=this.bounds,a=o[0]-s[0];this.position[0]<s[0]?this.position[0]+=a:this.position[0]>o[0]&&(this.position[0]-=a);let l=o[2]-s[2];this.position[2]<s[2]?this.position[2]+=l:this.position[2]>o[2]&&(this.position[2]-=l),this.position[1]<s[1]?(this.position[1]=s[1],this.velocity[1]=Math.max(0,this.velocity[1])):this.position[1]>o[1]&&(this.position[1]=o[1],this.velocity[1]=Math.min(0,this.velocity[1]))}let n=x.length(this.velocity);n>this.maxSpeed&&x.scale(this.velocity,this.velocity,this.maxSpeed/n),x.scale(this.velocity,this.velocity,this.linearDamping),this.target&&this.target.updateTransform&&this.target.updateTransform(this.instanceIndex,Array.from(this.position),Array.from(this.rotation),null)}rotateYaw(t){let i=b.create();b.setAxisAngle(i,this.baseUp,t),b.multiply(this.rotation,i,this.rotation),b.normalize(this.rotation,this.rotation)}rotatePitch(t){let i=b.create();b.setAxisAngle(i,this.right,t),b.multiply(this.rotation,i,this.rotation),b.normalize(this.rotation,this.rotation)}rotateRoll(t){let i=b.create();b.setAxisAngle(i,this.forward,t),b.multiply(this.rotation,i,this.rotation),b.normalize(this.rotation,this.rotation)}setPosition(t,i,r){x.set(this.position,t,i,r)}setRotation(t){b.copy(this.rotation,t)}resetRotation(){b.identity(this.rotation)}dispose(){window.removeEventListener("keydown",this.onKeyDown),window.removeEventListener("keyup",this.onKeyUp),this.poseTrackingActive=!1,this.poseVideo&&(this.poseVideo.srcObject.getTracks().forEach(t=>t.stop()),this.poseVideo.remove())}};var $t=class e extends j{constructor(t,i=1,r={}){super();let{color:n=[Math.random(),Math.random(),Math.random(),1]}=r;this.radius=t,this.frequency=i,this.baseColor=n,this.generateGeodesicSphere(),this.originalPositions=this.vertices.map(s=>s.position.slice())}generateGeodesicSphere(){let t=(1+Math.sqrt(5))/2,i=Math.sqrt(1+t*t);[[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]].map(s=>this.normalizeVector(s.map(o=>o/i))).forEach(s=>{this.addVertex(s,s,[0,0],this.baseColor)});let n=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];for(let s of n)this.subdivideFace(s,this.frequency);this.computeUVs(),this.generateEdges(),this.computeNormals()}subdivideFace(t,i){if(i===1){this.addFace(t,this.baseColor);return}let[r,n,s]=t.map(l=>this.vertices[l].position),o=new Map,a=(l,c)=>{if(l<0||c<0||l>i||c>i-l)return null;let h=`${l},${c}`;if(o.has(h))return o.get(h);let f=(i-l-c)/i,d=l/i,u=c/i,m=[r[0]*f+n[0]*d+s[0]*u,r[1]*f+n[1]*d+s[1]*u,r[2]*f+n[2]*d+s[2]*u],g=this.normalizeVector(m),p=this.addVertex(g,g,[0,0],this.baseColor);return o.set(h,p),p};for(let l=0;l<i;l++)for(let c=0;c<i-l;c++){let h=a(l,c),f=a(l,c+1),d=a(l+1,c),u=a(l+1,c+1);d!==null&&u!==null&&f!==null&&this.addFace([f,u,d],this.baseColor),h!==null&&d!==null&&f!==null&&this.addFace([h,f,d],this.baseColor)}}computeUVs(){this.vertices.forEach((t,i)=>{let r=t.position[0],n=t.position[1],s=t.position[2],o=Math.atan2(s,r);o<0&&(o+=2*Math.PI);let a=Math.acos(n/this.radius),l=o/(2*Math.PI),c=a/Math.PI;t.uv=[l,c],this.uvs[i*2]=l,this.uvs[i*2+1]=c})}normalizeVector(t){let i=Math.sqrt(t[0]*t[0]+t[1]*t[1]+t[2]*t[2]);return t.map(r=>r/i*this.radius)}transformVertices(t,i={}){let{updateNormals:r=!0,preserveOriginal:n=!0}=i;n&&!this.originalPositions&&(this.originalPositions=this.vertices.map(s=>s.position.slice())),this.vertices.forEach((s,o)=>{let a=t(s.position.slice(),s.normal.slice(),o);if(a&&Array.isArray(a)&&a.length===3){s.position=a;let l=o*3;this.positions[l]=a[0],this.positions[l+1]=a[1],this.positions[l+2]=a[2]}}),r&&this.computeNormals(),r&&this.vertices.forEach((s,o)=>{let a=o*3;this.normals[a]=s.normal[0],this.normals[a+1]=s.normal[1],this.normals[a+2]=s.normal[2]}),this.needsUpdate=!0}mergeVertices(t=1e-4){let i=new Map,r=new Map,n=[],s=t*t,o=l=>{let c=1/t;return`${Math.floor(l[0]*c)},${Math.floor(l[1]*c)},${Math.floor(l[2]*c)}`};this.vertices.forEach((l,c)=>{let h=o(l.position);i.has(h)||i.set(h,[]);let f=!1;for(let d of i.get(h)){let u=l.position[0]-d.vertex.position[0],m=l.position[1]-d.vertex.position[1],g=l.position[2]-d.vertex.position[2];if(u*u+m*m+g*g<=s){r.set(c,d.newIndex),f=!0;break}}if(!f){let d=n.length;r.set(c,d),n.push(l),i.get(h).push({vertex:l,newIndex:d})}});let a=this.vertices.length-n.length;if(a===0)return 0;if(this.vertices=n,this.faces.forEach(l=>{l.vertices=l.vertices.map(c=>r.get(c))}),this.indices=[],this.faces.forEach(l=>{this.indices.push(...l.vertices)}),this.positions=new Float32Array(this.vertices.length*3),this.normals=new Float32Array(this.vertices.length*3),this.uvs=new Float32Array(this.vertices.length*2),this.colors=new Float32Array(this.vertices.length*4),this.vertices.forEach((l,c)=>{let h=c*3,f=c*2,d=c*4;this.positions[h]=l.position[0],this.positions[h+1]=l.position[1],this.positions[h+2]=l.position[2],this.normals[h]=l.normal[0],this.normals[h+1]=l.normal[1],this.normals[h+2]=l.normal[2],this.uvs[f]=l.uv[0],this.uvs[f+1]=l.uv[1],this.colors[d]=l.color[0],this.colors[d+1]=l.color[1],this.colors[d+2]=l.color[2],this.colors[d+3]=l.color[3]}),this.generateEdges(),this.originalPositions){let l=[];this.vertices.forEach((c,h)=>{for(let[f,d]of r.entries())if(d===h&&this.originalPositions[f]){l[h]=this.originalPositions[f];break}}),this.originalPositions=l}return this.needsUpdate=!0,a}resetVertices(){if(!this.originalPositions){console.warn("No original positions stored. Cannot reset.");return}this.vertices.forEach((t,i)=>{t.position=this.originalPositions[i].slice();let r=i*3;this.positions[r]=t.position[0],this.positions[r+1]=t.position[1],this.positions[r+2]=t.position[2]}),this.computeNormals(),this.needsUpdate=!0}addSphereInstance(t=[0,0,0],i=[0,0,0,1],r=[1,1,1],n=null){let s=n||this.baseColor;return this.addInstance(t,i,r,s),this.instanceCount-1}addGridInstances(t=3,i=5,r={}){let{randomColor:n=!1,randomScale:s=!1,randomRotation:o=!1,baseColor:a=this.baseColor}=r,l=-(t-1)*i/2;for(let c=0;c<t;c++)for(let h=0;h<t;h++)for(let f=0;f<t;f++){let d=[l+c*i,l+h*i,l+f*i],u=o?[Math.random()*Math.PI*2,Math.random()*Math.PI*2,Math.random()*Math.PI*2,1]:[0,0,0,1],m=s?[.5+Math.random()*1.5,.5+Math.random()*1.5,.5+Math.random()*1.5]:[1,1,1],g=n?[Math.random(),Math.random(),Math.random(),1]:a;this.addSphereInstance(d,u,m,g)}}addSpiralInstances(t=20,i=10,r=5,n={}){let{randomColor:s=!1,randomScale:o=!1,baseColor:a=this.baseColor}=n;for(let l=0;l<t;l++){let c=l/(t-1),h=c*Math.PI*4,f=i*c,d=(c-.5)*r,u=[Math.cos(h)*f,d,Math.sin(h)*f],m=[0,h,0,1],g=o?[.5+Math.random()*1,.5+Math.random()*1,.5+Math.random()*1]:[1,1,1],p=s?[Math.random(),Math.random(),Math.random(),1]:a;this.addSphereInstance(u,m,g,p)}}updateInstance(t,i,r,n,s){if(t<0||t>=this.instanceCount){console.warn("Instance index out of bounds");return}let o=t*3,a=t*4;i&&(this.instancePositions[o]=i[0],this.instancePositions[o+1]=i[1],this.instancePositions[o+2]=i[2]),r&&(this.instanceRotations[a]=r[0],this.instanceRotations[a+1]=r[1],this.instanceRotations[a+2]=r[2],this.instanceRotations[a+3]=r[3]),n&&(this.instanceScales[o]=n[0],this.instanceScales[o+1]=n[1],this.instanceScales[o+2]=n[2]),s&&(this.instanceColors[a]=s[0],this.instanceColors[a+1]=s[1],this.instanceColors[a+2]=s[2],this.instanceColors[a+3]=s[3])}animateInstances(t){for(let i=0;i<this.instanceCount;i++){let r=i*3,n=i*4,s=.01+i*.001,o=b.create();b.set(o,this.instanceRotations[n],this.instanceRotations[n+1],this.instanceRotations[n+2],this.instanceRotations[n+3]);let a=b.create();b.fromEuler(a,0,s*180/Math.PI,0),b.multiply(o,o,a),this.instanceRotations[n]=o[0],this.instanceRotations[n+1]=o[1],this.instanceRotations[n+2]=o[2],this.instanceRotations[n+3]=o[3];let l=.02+i*.01,c=.5,h=this.instancePositions[r+1];this.instancePositions[r+1]=h+Math.sin(t*l+i)*c}}getInstanceData(t){if(t<0||t>=this.instanceCount)return console.warn("Instance index out of bounds"),null;let i=t*3,r=t*4;return{position:[this.instancePositions[i],this.instancePositions[i+1],this.instancePositions[i+2]],rotation:[this.instanceRotations[r],this.instanceRotations[r+1],this.instanceRotations[r+2],this.instanceRotations[r+3]],scale:[this.instanceScales[i],this.instanceScales[i+1],this.instanceScales[i+2]],color:[this.instanceColors[r],this.instanceColors[r+1],this.instanceColors[r+2],this.instanceColors[r+3]]}}static create(t,i=1,r={}){return new e(t,i,r)}};var no=Array.from(new Array(1024),e=>Math.random()*1024),so=Array.from(new Array(1024),e=>Math.random()*1024),oo=Array.from(new Array(1024),e=>Math.random()*1024),ao=154003976,nt=(e,t,i)=>(e=Math.imul(((e&1023)<<20|(t&1023)<<10|i&1023)^ao,2654435761),e<<=3+(e>>>29),(e>>>1)/2**31-.5),Ni=(e,t,i,r,n,s=1,o=s<2?0:Ni(e,t,i,r*2,(n+73)%99,s-1)/2,a=Math.floor(e=e*r+no[n]),l=Math.floor(t=t*r+so[n]),c=Math.floor(i=i*r+oo[n]))=>(e-=a,t-=l,i-=c,e*=e*(3-2*e),t*=t*(3-2*t),i*=i*(3-2*i),nt(a,l,c)*(1-e)*(1-t)*(1-i)+nt(a,l,c+1)*(1-e)*(1-t)*i+nt(a,l+1,c)*(1-e)*t*(1-i)+nt(a,l+1,c+1)*(1-e)*t*i+nt(a+1,l,c)*e*(1-t)*(1-i)+nt(a+1,l,c+1)*e*(1-t)*i+nt(a+1,l+1,c)*e*t*(1-i)+nt(a+1,l+1,c+1)*e*t*i+o),te=class extends j{constructor(t={}){super();let{width:i=1,height:r=1,depth:n=1,position:s=[0,0,0],color:o=[1,1,1,1],uvScale:a=1}=t;this.position=x.fromValues(...s),this.rotation=b.create(),this.originalPositions=[],this.createCube(i,r,n,s,o,a),this.originalPositions=this.vertices.map(l=>l.position.slice())}createCube(t,i,r,n,s,o){let a=t/2,l=i/2,c=r/2,h=[[-a,l,c],[a,l,c],[-a,-l,c],[a,-l,c],[a,l,-c],[-a,l,-c],[a,-l,-c],[-a,-l,-c],[-a,l,-c],[-a,l,c],[-a,-l,-c],[-a,-l,c],[a,l,c],[a,l,-c],[a,-l,c],[a,-l,-c],[-a,l,-c],[a,l,-c],[-a,l,c],[a,l,c],[-a,-l,c],[a,-l,c],[-a,-l,-c],[a,-l,-c]];this.edges=[0,1,1,3,3,2,2,0,5,4,4,6,6,7,7,5,5,0,7,2,1,4,3,6,5,0,4,1,7,2,6,3];let f=[[0,0],[o,0],[0,o],[o,o]],d=[...f,...f,...f,...f,...f,...f],u=[0,1,2,1,3,2,4,5,6,5,7,6,8,9,10,9,11,10,12,13,14,13,15,14,16,17,18,17,18,19,20,21,22,21,23,22];h.forEach((m,g)=>{this.addVertex([m[0]+n[0],m[1]+n[1],m[2]+n[2]],m.map(p=>p/Math.max(a,l,c)),d[g],s)});for(let m=0;m<u.length;m+=3)this.addFace([u[m],u[m+1],u[m+2]]);this.computeNormals()}applyTransformation(t){for(let i=0;i<this.vertices.length;i++){let r=this.vertices[i],n=r.position.slice(),s=t(n,i);r.position=s;let o=i*3;this.positions[o]=s[0],this.positions[o+1]=s[1],this.positions[o+2]=s[2]}}applyCurrentTransform(){let t=D.create();return D.fromRotationTranslation(t,this.rotation,this.position),this.applyTransformation((i,r)=>{let n=x.fromValues(...this.originalPositions[r]),s=x.create();return x.transformMat4(s,n,t),[s[0],s[1],s[2]]}),this}setRotation(t,i,r){return b.fromEuler(this.rotation,t*180/Math.PI,i*180/Math.PI,r*180/Math.PI),this.applyCurrentTransform(),this}setDirection(t){let i=x.fromValues(...t);if(x.normalize(i,i),i[1]>.99999)b.set(this.rotation,0,0,0,1);else if(i[1]<-.99999)b.set(this.rotation,1,0,0,0);else{let r=x.fromValues(i[2],0,-i[0]);x.normalize(r,r);let n=Math.acos(i[1]);b.setAxisAngle(this.rotation,r,n)}this.applyCurrentTransform()}rotate(t,i,r){let n=b.create();return b.fromEuler(n,t*180/Math.PI,i*180/Math.PI,r*180/Math.PI),b.multiply(this.rotation,this.rotation,n),this.applyCurrentTransform(),this}rotateAxis(t,i){let r=x.fromValues(...t);x.normalize(r,r);let n=b.create();return b.setAxisAngle(n,r,i),b.multiply(this.rotation,this.rotation,n),this.applyCurrentTransform(),this}getEulerAngles(){let t=[0,0,0],i=2*(this.rotation[3]*this.rotation[1]+this.rotation[0]*this.rotation[2]),r=1-2*(this.rotation[1]*this.rotation[1]+this.rotation[2]*this.rotation[2]);t[1]=Math.atan2(i,r);let n=2*(this.rotation[3]*this.rotation[0]-this.rotation[2]*this.rotation[1]);Math.abs(n)>=1?t[0]=Math.PI/2*Math.sign(n):t[0]=Math.asin(n);let s=2*(this.rotation[3]*this.rotation[2]+this.rotation[0]*this.rotation[1]),o=1-2*(this.rotation[0]*this.rotation[0]+this.rotation[2]*this.rotation[2]);return t[2]=Math.atan2(s,o),t}scale(t,i,r){this.applyTransformation((n,s)=>{let o=this.originalPositions[s];return[o[0]*t,o[1]*i,o[2]*r]})}translate(t,i,r){let n=[t,i,r];this.applyTransformation((s,o)=>{let a=this.originalPositions[o];return[a[0]+n[0],a[1]+n[1],a[2]+n[2]]})}static createGrid(t={}){let{rows:i=1,cols:r=1,spacing:n=1.2,width:s=1,height:o=1,depth:a=1,baseColor:l=[1,0,1,1],colorVariation:c=.2,uvScale:h=1}=t,f=[],d=(i-1)/2,u=(r-1)/2;for(let m=0;m<i;m++)for(let g=0;g<r;g++){let p=(g-u)*n,v=(m-d)*n,A=l.map((w,P)=>P===3?w:w*p+v*c),M=Ni(m,g,0,.05,1,6)*2;f.push(new Cube({width:s,height:o,depth:a,position:[p,0,v],color:A,uvScale:h}))}return f}};var Oi=(e,t,i,r)=>{let{spacing:n=1,jitter:s=0,noise:o}=r,a=Math.ceil(Math.cbrt(t/3)),l=Math.ceil(a),c=i[0][1]-i[0][0],h=i[1][1]-i[1][0],f=i[2][1]-i[2][0],d=0;for(let m=0;m<a&&d<t;m++)for(let g=0;g<a&&d<t;g++)for(let p=0;p<l&&d<t;p++){let v=l>1?p/(l-1):0,A=i[0][0]+v*c*n,y=i[1][0]+g/(a-1)*h*n,M=i[2][0]+m/(a-1)*f*n;e[d*4+0]=A+(Math.random()-.5)*s,e[d*4+1]=y+(Math.random()-.5)*s,e[d*4+2]=M+(Math.random()-.5)*s,e[d*4+3]=1,d++}for(let m=0;m<a&&d<t;m++)for(let g=0;g<a&&d<t;g++)for(let p=0;p<l&&d<t;p++){let v=l>1?p/(l-1):0,A=i[0][0]+g/(a-1)*c*n,y=i[1][0]+v*h*n,M=i[2][0]+m/(a-1)*f*n;e[d*4+0]=A+(Math.random()-.5)*s,e[d*4+1]=y+(Math.random()-.5)*s,e[d*4+2]=M+(Math.random()-.5)*s,e[d*4+3]=1,d++}for(let m=0;m<a&&d<t;m++)for(let g=0;g<a&&d<t;g++)for(let p=0;p<l&&d<t;p++){let v=l>1?p/(l-1):0,A=i[0][0]+g/(a-1)*c*n,y=i[1][0]+m/(a-1)*h*n,M=i[2][0]+v*f*n;e[d*4+0]=A+(Math.random()-.5)*s,e[d*4+1]=y+(Math.random()-.5)*s,e[d*4+2]=M+(Math.random()-.5)*s,e[d*4+3]=1,d++}let u=[];for(let m=0;m<d;m++)u.push({x:e[m*4+0],y:e[m*4+1],z:e[m*4+2],w:e[m*4+3],originalIndex:m});u.sort((m,g)=>o(m.x,m.y,m.z,.5,100,1)-o(g.x,g.y,g.z,.5,100,1));for(let m=0;m<u.length;m++){let g=u[m];e[m*4+0]=g.x,e[m*4+1]=g.y,e[m*4+2]=g.z,e[m*4+3]=g.w}return e};var ee=class{constructor(t,i,r={}){this.gl=t,this.particleTexWidth=r.width||20,this.particleTexHeight=r.height||10,this.numParticles=this.particleTexWidth*this.particleTexHeight,this.canvasWidth=r.canvasWidth||t.canvas.width,this.canvasHeight=r.canvasHeight||t.canvas.height,this.bounds=r.positionRange,this.gravity=r.gravity||[0,-50],this.damping=r.damping||.99,this.wrap=r.wrap!==!1,this.setupWebGL(),this.createShaders(i),this.initializeTextures(r),this.setupFramebuffers(),this.setupQuad(),this.renderGeometry=r.geometry||null,this.renderMaterial=r.material||null,this.lastTime=0}setupWebGL(){if(!this.gl.getExtension("EXT_color_buffer_float"))throw new Error("EXT_color_buffer_float extension required for GPGPU particles")}createShaders(t){let i=this.gl,r=t.PVS||`#version 300 es
      in vec4 position;
      void main() {
        gl_Position = position;
      }
    `,n=t.PFS||`#version 300 es
      precision highp float;

      uniform sampler2D uPositionTex;
      uniform sampler2D uVelocityTex;
      uniform vec3 uCanvasDimensions;
      //uniform vec2 uGravity;
      uniform float uDeltaTime;
      //uniform float uDamping;
      uniform bool uWrap;

      out vec4 outColor;

      vec3 euclideanModulo(vec3 n, vec3 m) {
        return mod(mod(n, m) + m, m);
      }

      void main() {
        ivec2 texelCoord = ivec2(gl_FragCoord.xy);
        
        vec3 position = texelFetch(uPositionTex, texelCoord, 0).xyz;
        vec3 velocity = texelFetch(uVelocityTex, texelCoord, 0).xyz;
    
        
        // Update position
        vec3 newPosition = position + velocity * uDeltaTime;
        
        // Handle boundaries
        if (uWrap) {
          // Wrap around centered boundary (-5 to 5)
          newPosition = euclideanModulo(newPosition + 5.0, vec3(10.0)) - 5.0;
        } else {
          // Bounce off centered edges (-5 to 5)
          if (newPosition.x < -5.0 || newPosition.x > 5.0) {
            velocity.x *= -0.8;
            newPosition.x = clamp(newPosition.x, -5.0, 5.0);
          }
          if (newPosition.y < -5.0 || newPosition.y > 5.0) {
            velocity.y *= -0.8;
            newPosition.y = clamp(newPosition.y, -5.0, 5.0);
          }
          if (newPosition.z < -5.0 || newPosition.z > 5.0) {
            velocity.z *= -0.8;
            newPosition.z = clamp(newPosition.z, -5.0, 5.0);
          }
        }

        outColor = vec4(newPosition, 1);
      }
    `,s=t.VFS||`#version 300 es
      precision highp float;

      uniform sampler2D uPositionTex;
      uniform sampler2D uVelocityTex;
      
      uniform vec3 uCanvasDimensions;
      // uniform vec2 uGravity;
      // uniform float uDeltaTime;
      // uniform float uDamping;
      // uniform vec2 uMousePos;
      // uniform float uMouseForce;

      out vec4 outColor;

      void main() {
        ivec2 texelCoord = ivec2(gl_FragCoord.xy);
        
        vec3 position = texelFetch(uPositionTex, texelCoord, 0).xyz;
        vec3 velocity = texelFetch(uVelocityTex, texelCoord, 0).xyz;
        
        // Apply gravity
        //velocity += uGravity * uDeltaTime;
        
        // Mouse interaction
        //vec2 mouseDir = uMousePos - position;
        //float mouseDist = length(mouseDir);
        // if (mouseDist > 0.0 && mouseDist < 100.0) {
        //   velocity += normalize(mouseDir) * uMouseForce * (1.0 - mouseDist / 100.0) * uDeltaTime;
        // }
        
        // // Apply damping
        // velocity *= uDamping;
        
        // // Handle boundary velocity changes
        // if (position.x <= 0.0 || position.x >= uCanvasDimensions.x) {
        //   velocity.x *= -0.8;
        // }
        // if (position.y <= 0.0 || position.y >= uCanvasDimensions.y) {
        //   velocity.y *= -0.8;
        // }

        outColor = vec4(position * 0.0 + velocity * 0.0, 1);
      }
    `,o=t.drawPVS||`#version 300 es
      uniform sampler2D uPositionTex;
      uniform mat4 uView;
      uniform mat4 uProjection;
      uniform mat4 uModel;
      uniform float uPointSize;

      vec4 getValueFrom2DTextureAs1DArray(sampler2D tex, ivec2 dimensions, int index) {
        int y = index / dimensions.x;
        int x = index % dimensions.x;
        return texelFetch(tex, ivec2(x, y), 0);
      }

      void main() {
        ivec2 texDimensions = textureSize(uPositionTex, 0);
        vec4 position = getValueFrom2DTextureAs1DArray(uPositionTex, texDimensions, gl_VertexID);

        gl_Position = uProjection * uView * uModel * vec4(position.xyz, 1);
        gl_PointSize = uPointSize;
      }
    `,a=t.drawPFS||`#version 300 es
      precision highp float;
      uniform vec4 uColor;
      out vec4 outColor;
      
      void main() {
        // Create circular particles
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        //if (dist > 0.5) discard;
        
        float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
        //outColor = vec4(uColor.rgb, uColor.a * alpha);
        outColor = vec4(0,0,0,1);
      }
    `;this.updatePositionShader=new dt(i,r,n),this.updateVelocityShader=new dt(i,r,s),this.renderShader=new dt(i,o,a)}initializeTextures(t){let i=this.gl,r=(f,d)=>(d===void 0&&(d=f,f=0),Math.random()*(d-f)+f),n=new Float32Array(this.numParticles*4),s=new Float32Array(this.numParticles*4),o=t.positionRange||[[-50,50],[-5,5],[-50,50]],a=t.velocityRange||[[-1,1],[-1,1],[-1,1]],l=new Float32Array(this.numParticles*4);Oi(n,this.numParticles,t.positionRange,t);for(let f=0;f<this.numParticles;f++){let d=f*4;s[d]=r(...a[0]),s[d+1]=r(...a[1]),s[d+2]=r(...a[2]),s[d+3]=1,l[d]=1,l[d+1]=1,l[d+2]=1,l[d+3]=1}this.velocityTexture=this.createDataTexture(s),this.positionTexture1=this.createDataTexture(n),this.positionTexture2=this.createDataTexture(null),this.velocityTexture1=this.createDataTexture(s),this.velocityTexture2=this.createDataTexture(null),this.colorTexture=this.createDataTexture(l);let c=n.slice();this.initPositionsTexture=this.createDataTexture(c);let h=new Float32Array(this.numParticles*4);Oi(h,this.numParticles,t.positionRange,t),this.gridPositionsTexture=this.createDataTexture(h)}createDataTexture(t){let i=this.gl,r=i.createTexture();return i.bindTexture(i.TEXTURE_2D,r),i.texImage2D(i.TEXTURE_2D,0,i.RGBA32F,this.particleTexWidth,this.particleTexHeight,0,i.RGBA,i.FLOAT,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),r}setupFramebuffers(){this.positionFBO1=new xt(this.gl,this.particleTexWidth,this.particleTexHeight),this.positionFBO2=new xt(this.gl,this.particleTexWidth,this.particleTexHeight),this.velocityFBO1=new xt(this.gl,this.particleTexWidth,this.particleTexHeight),this.velocityFBO2=new xt(this.gl,this.particleTexWidth,this.particleTexHeight),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.positionFBO1.fbo),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.positionTexture1,0),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.positionFBO2.fbo),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.positionTexture2,0),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.velocityFBO1.fbo),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.velocityTexture1,0),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.velocityFBO2.fbo),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.velocityTexture2,0),this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.currentPositionRead={fbo:this.positionFBO1.fbo,texture:this.positionTexture1},this.currentPositionWrite={fbo:this.positionFBO2.fbo,texture:this.positionTexture2},this.currentVelocityRead={fbo:this.velocityFBO1.fbo,texture:this.velocityTexture1},this.currentVelocityWrite={fbo:this.velocityFBO2.fbo,texture:this.velocityTexture2}}setupQuad(){let t=this.gl;this.quadBuffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.quadBuffer),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),t.STATIC_DRAW),this.quadVAO=t.createVertexArray(),t.bindVertexArray(this.quadVAO),t.bindBuffer(t.ARRAY_BUFFER,this.quadBuffer),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0),t.bindVertexArray(null)}update(t,i,r,n={}){let s=this.gl;this.canvasWidth=n.canvasWidth||s.canvas.width,this.canvasHeight=n.canvasHeight||s.canvas.height;let o=n.mousePos||[0,0],a=n.mouseForce||0;n.updateVelocities!==!1&&(s.bindFramebuffer(s.FRAMEBUFFER,this.currentVelocityWrite.fbo),s.viewport(0,0,this.particleTexWidth,this.particleTexHeight),s.bindVertexArray(this.quadVAO),this.updateVelocityShader.use(),this.updateVelocityShader.setTextures({uPositionTex:this.currentPositionRead.texture,uVelocityTex:this.currentVelocityRead.texture}),this.updateVelocityShader.setUniforms({}),s.drawArrays(s.TRIANGLES,0,6),this.swapVelocityBuffers()),s.bindFramebuffer(s.FRAMEBUFFER,this.currentPositionWrite.fbo),s.viewport(0,0,this.particleTexWidth,this.particleTexHeight),s.bindVertexArray(this.quadVAO),this.updatePositionShader.use(),this.updatePositionShader.setTextures({uPositionTex:this.currentPositionRead.texture,uVelocityTex:this.currentVelocityRead.texture,uInitPositionsTex:this.initPositionsTexture,uGridPositions:this.gridPositionsTexture}),this.updatePositionShader.setUniforms(r),s.drawArrays(s.TRIANGLES,0,6),this.swapPositionBuffers(),s.bindFramebuffer(s.FRAMEBUFFER,null),s.viewport(0,0,s.canvas.width,s.canvas.height)}render(t,i,r,n={}){let s=this.gl;this.renderAsPoints(t,i,r,n)}renderAsPoints(t,i,r,n={}){let s=this.gl,o=n.pointSize||10,a=n.color||[1,0,0,1];this.renderShader.use(),this.renderShader.setTextures({uPositionTex:this.currentPositionRead.texture,uColorTex:this.colorTexture}),this.renderShader.setUniforms({uProjection:i,uView:t,uModel:r,uPointSize:o,colors:n.palette}),s.drawArrays(s.POINTS,0,this.numParticles)}renderWithGeometry(t,i={}){let r=this.gl;!this.renderGeometry||!this.renderMaterial||(this.updateInstanceData(),this.renderMaterial.setProperty("uMatrix",t),this.renderMaterial.setTexture("uPositionTex",this.currentPositionRead.texture),this.renderGeometry.renderWithMaterial(r,this.renderMaterial))}updateInstanceData(){}swapPositionBuffers(){let t=this.currentPositionRead;this.currentPositionRead=this.currentPositionWrite,this.currentPositionWrite=t}swapVelocityBuffers(){let t=this.currentVelocityRead;this.currentVelocityRead=this.currentVelocityWrite,this.currentVelocityWrite=t}getCurrentPositionTexture(){return this.currentPositionRead.texture}getCurrentVelocityTexture(){return this.currentVelocityRead.texture}setGravity(t){this.gravity=t}setDamping(t){this.damping=t}setWrap(t){this.wrap=t}dispose(){let t=this.gl;this.updatePositionShader.destroy(),this.updateVelocityShader.destroy(),this.renderShader.destroy(),this.positionFBO1.destroy(),this.positionFBO2.destroy(),this.velocityFBO1.destroy(),this.velocityFBO2.destroy(),t.deleteTexture(this.positionTexture1),t.deleteTexture(this.positionTexture2),t.deleteTexture(this.velocityTexture1),t.deleteTexture(this.velocityTexture2),t.deleteBuffer(this.quadBuffer),t.deleteVertexArray(this.quadVAO)}};var ie=class{constructor(t,i=128){this.resolution=i,this._computeBounds(t.positions),this.grid=new Float32Array(i*i).fill(-1/0),this.normalGrid=new Float32Array(i*i*3).fill(0),this._rasterize(t);for(let r=0;r<this.grid.length;r++)this.grid[r]===-1/0&&(this.grid[r]=0);this._normalizeNormalGrid()}_computeBounds(t){let i=1/0,r=-1/0,n=1/0,s=-1/0;for(let a=0;a<t.length;a+=3){let l=t[a],c=t[a+2];l<i&&(i=l),l>r&&(r=l),c<n&&(n=c),c>s&&(s=c)}let o=.001;this.minX=i-o,this.maxX=r+o,this.minZ=n-o,this.maxZ=s+o}_rasterize(t){let{positions:i,faces:r,vertices:n}=t;for(let s=0;s<n.length;s++){let o=i[s*3],a=i[s*3+1],l=i[s*3+2];if(!this.inBounds(o,l))continue;let c=this.resolution,h=Math.round((o-this.minX)/(this.maxX-this.minX)*(c-1)),d=Math.round((l-this.minZ)/(this.maxZ-this.minZ)*(c-1))*c+h;if(a>this.grid[d]){this.grid[d]=a;let u=n[s].normal??[0,1,0];this.normalGrid[d*3]=u[0],this.normalGrid[d*3+1]=u[1],this.normalGrid[d*3+2]=u[2]}}for(let s of r){let o=s.vertices;for(let a=1;a<o.length-1;a++)this._rasterizeTriangle(o[0],o[a],o[a+1],i,n)}}_rasterizeTriangle(t,i,r,n,s){let o=this.resolution,a=n[t*3],l=n[t*3+1],c=n[t*3+2],h=n[i*3],f=n[i*3+1],d=n[i*3+2],u=n[r*3],m=n[r*3+1],g=n[r*3+2],p=s[t]?.normal??[0,1,0],v=s[i]?.normal??[0,1,0],A=s[r]?.normal??[0,1,0],y=O=>(O-this.minX)/(this.maxX-this.minX)*(o-1),M=O=>(O-this.minZ)/(this.maxZ-this.minZ)*(o-1),w=y(a),P=M(c),T=y(h),S=M(d),R=y(u),E=M(g),B=Math.max(0,Math.floor(Math.min(w,T,R))-1),F=Math.min(o-1,Math.ceil(Math.max(w,T,R))+1),V=Math.max(0,Math.floor(Math.min(P,S,E))-1),C=Math.min(o-1,Math.ceil(Math.max(P,S,E))+1),N=(this.maxX-this.minX)/(o-1),Y=(this.maxZ-this.minZ)/(o-1);for(let O=V;O<=C;O++)for(let K=B;K<=F;K++){let ht=O*o+K,wt=this.minX+K*N,Pt=this.minZ+O*Y,lr=[[wt,Pt],[wt-N*.5,Pt-Y*.5],[wt+N*.5,Pt-Y*.5],[wt-N*.5,Pt+Y*.5],[wt+N*.5,Pt+Y*.5]];for(let[cr,hr]of lr){let ze=this._barycentric2D(cr,hr,a,c,h,d,u,g);if(ze===null)continue;let[Ut,Nt,Ot]=ze,Se=Ut*l+Nt*f+Ot*m;if(Se>this.grid[ht]){this.grid[ht]=Se;let ae=ht*3;this.normalGrid[ae]=Ut*p[0]+Nt*v[0]+Ot*A[0],this.normalGrid[ae+1]=Ut*p[1]+Nt*v[1]+Ot*A[1],this.normalGrid[ae+2]=Ut*p[2]+Nt*v[2]+Ot*A[2]}}}}_barycentric2D(t,i,r,n,s,o,a,l){let c=(o-l)*(r-a)+(a-s)*(n-l);if(Math.abs(c)<1e-10)return null;let h=((o-l)*(t-a)+(a-s)*(i-l))/c,f=((l-n)*(t-a)+(r-a)*(i-l))/c,d=1-h-f;return h<-1e-6||f<-1e-6||d<-1e-6?null:[h,f,d]}_normalizeNormalGrid(){for(let t=0;t<this.normalGrid.length;t+=3){let i=this.normalGrid[t],r=this.normalGrid[t+1],n=this.normalGrid[t+2],s=Math.sqrt(i*i+r*r+n*n);s>1e-6?(this.normalGrid[t]/=s,this.normalGrid[t+1]/=s,this.normalGrid[t+2]/=s):(this.normalGrid[t]=0,this.normalGrid[t+1]=1,this.normalGrid[t+2]=0)}}getHeight(t,i){let r=this.resolution,n=(t-this.minX)/(this.maxX-this.minX)*(r-1),s=(i-this.minZ)/(this.maxZ-this.minZ)*(r-1),o=Math.max(0,Math.min(r-2,Math.floor(n))),a=Math.max(0,Math.min(r-2,Math.floor(s))),l=o+1,c=a+1,h=n-o,f=s-a,d=this.grid[a*r+o],u=this.grid[a*r+l],m=this.grid[c*r+o],g=this.grid[c*r+l];return d*(1-h)*(1-f)+u*h*(1-f)+m*(1-h)*f+g*h*f}getNormal(t,i){let r=this.resolution,n=(t-this.minX)/(this.maxX-this.minX)*(r-1),s=(i-this.minZ)/(this.maxZ-this.minZ)*(r-1),o=Math.max(0,Math.min(r-2,Math.floor(n))),a=Math.max(0,Math.min(r-2,Math.floor(s))),l=o+1,c=a+1,h=n-o,f=s-a,d=[0,0,0];for(let m=0;m<3;m++){let g=this.normalGrid[(a*r+o)*3+m],p=this.normalGrid[(a*r+l)*3+m],v=this.normalGrid[(c*r+o)*3+m],A=this.normalGrid[(c*r+l)*3+m];d[m]=g*(1-h)*(1-f)+p*h*(1-f)+v*(1-h)*f+A*h*f}let u=Math.sqrt(d[0]*d[0]+d[1]*d[1]+d[2]*d[2]);return u>1e-6&&(d[0]/=u,d[1]/=u,d[2]/=u),d}inBounds(t,i){return t>=this.minX&&t<=this.maxX&&i>=this.minZ&&i<=this.maxZ}resolveSphereBounce(t,i,r=.5,n=.3,s=.8){if(!this.inBounds(t[0],t[2]))return null;let o=this.getHeight(t[0],t[2]),a=t[1]-r,l=o-a;if(l<=0)return null;t[1]+=l;let c=this.getNormal(t[0],t[2]),h=i[0]*c[0]+i[1]*c[1]+i[2]*c[2];if(h<0){i[0]-=(1+n)*h*c[0],i[1]-=(1+n)*h*c[1],i[2]-=(1+n)*h*c[2];let f=i[0]-i[0]*c[0]*c[0],d=i[2]-i[2]*c[2]*c[2];i[0]-=f*s*Math.abs(h)*.016,i[2]-=d*s*Math.abs(h)*.016}return{hit:!0,normal:c,depth:l}}resolvePoint(t,i,r=0){if(!this.inBounds(t[0],t[2]))return null;let s=this.getHeight(t[0],t[2])-t[1];if(s<=0)return null;t[1]+=s;let o=this.getNormal(t[0],t[2]),a=i[0]*o[0]+i[1]*o[1]+i[2]*o[2];return a<0&&(i[0]-=(1+r)*a*o[0],i[1]-=(1+r)*a*o[1],i[2]-=(1+r)*a*o[2]),{hit:!0,normal:o,depth:s}}query(t,i=0){if(!this.inBounds(t[0],t[2]))return null;let r=this.getHeight(t[0],t[2]),n=r-(t[1]-i);if(n<=0)return null;let s=this.getNormal(t[0],t[2]),o=[t[0]-s[0]*n,t[1]+n,t[2]-s[2]*n];return{hit:!0,normal:s,depth:n,groundY:r,hitPoint:o}}debugInfo(){let t=1/0,i=-1/0;for(let r=0;r<this.grid.length;r++)this.grid[r]<t&&(t=this.grid[r]),this.grid[r]>i&&(i=this.grid[r]);return{resolution:this.resolution,bounds:{minX:this.minX,maxX:this.maxX,minZ:this.minZ,maxZ:this.maxZ},heightRange:{min:t,max:i}}}};var lo=Array.from(new Array(1024),e=>$fx.rand()*1024),co=Array.from(new Array(1024),e=>$fx.rand()*1024),ho=Array.from(new Array(1024),e=>$fx.rand()*1024),fo=154003976,st=(e,t,i)=>(e=Math.imul(((e&1023)<<20|(t&1023)<<10|i&1023)^fo,2654435761),e<<=3+(e>>>29),(e>>>1)/2**31-.5),Re=(e,t,i,r,n,s=1,o=s<2?0:Re(e,t,i,r*2,(n+73)%99,s-1)/2,a=Math.floor(e=e*r+lo[n]),l=Math.floor(t=t*r+co[n]),c=Math.floor(i=i*r+ho[n]))=>(e-=a,t-=l,i-=c,e*=e*(3-2*e),t*=t*(3-2*t),i*=i*(3-2*i),st(a,l,c)*(1-e)*(1-t)*(1-i)+st(a,l,c+1)*(1-e)*(1-t)*i+st(a,l+1,c)*(1-e)*t*(1-i)+st(a,l+1,c+1)*(1-e)*t*i+st(a+1,l,c)*e*(1-t)*(1-i)+st(a+1,l,c+1)*e*(1-t)*i+st(a+1,l+1,c)*e*t*(1-i)+st(a+1,l+1,c+1)*e*t*i+o),_i=$fx.rand()*2+1,qi=$fx.rand()*2+1,Yi=$fx.rand()*1+.01,xo=$fx.rand(),mo=Math.floor($fx.rand()*10),po=Math.floor($fx.rand()*25)+5,uo=$fx.rand()*.2+.05,go=$fx.rand();$fx.features({"A random feature":Math.floor($fx.rand()*10),"A random boolean":$fx.rand()>.5,"A random string":["A","B","C","D"].at(Math.floor($fx.rand()*4)),"Feature from params, its a number":$fx.getParam("number_id")});var Xi=`#version 300 es

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;
layout(location = 3) in vec4 aColor;
layout(location = 4) in vec3 aInstancePosition;
layout(location = 5) in vec4 aInstanceRotation;
layout(location = 6) in vec3 aInstanceScale;
layout(location = 7) in vec4 aInstanceColor;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform mat4 uTextureMatrix;
uniform float time;

out vec4 vColor;
out vec4 iColor;
out vec3 vNormal;
out vec3 vPos;
out vec2 vUV;
out vec4 vShadowCoord;
out vec3 vWorldPos;

// Quaternion rotation function
mat4 quatToMat4(vec4 q) {
    float x = q.x, y = q.y, z = q.z, w = q.w;
    float x2 = x + x, y2 = y + y, z2 = z + z;
    float xx = x * x2, xy = x * y2, xz = x * z2;
    float yy = y * y2, yz = y * z2, zz = z * z2;
    float wx = w * x2, wy = w * y2, wz = w * z2;
    
    return mat4(
        1.0 - (yy + zz), xy + wz, xz - wy, 0.0,
        xy - wz, 1.0 - (xx + zz), yz + wx, 0.0,
        xz + wy, yz - wx, 1.0 - (xx + yy), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

void main() {
    // Build instance transform matrix
    mat4 rotation = quatToMat4(aInstanceRotation);
    mat4 scale = mat4(
        aInstanceScale.x, 0.0, 0.0, 0.0,
        0.0, aInstanceScale.y, 0.0, 0.0,
        0.0, 0.0, aInstanceScale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 translation = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        aInstancePosition.x, aInstancePosition.y, aInstancePosition.z, 1.0
    );
    
    // Combine: Translation * Rotation * Scale
    mat4 instanceMatrix = translation * rotation * scale;
    mat4 finalModel = uModel * instanceMatrix;
    
    vec4 worldPosition = finalModel * vec4(aPosition, 1.0);
    vWorldPos = worldPosition.xyz;

    gl_Position = uProjection * uView * worldPosition;
    gl_PointSize = 2.0;
    
    // Mix vertex color with instance color
    vColor = aColor * aInstanceColor;
    iColor = aInstanceColor;
    vNormal = (finalModel * vec4(aNormal, 0.0)).xyz;

    vPos = vec3(aPosition.xyz);
    vUV = aUV;
    
    // Transform to light space for shadow mapping
    vShadowCoord = uTextureMatrix * worldPosition;
}
`,vo=`#version 300 es

precision highp float;

in vec4 vColor;
in vec4 iColor;
in vec3 vNormal;
in vec3 vPos;
in vec2 vUV;
in vec4 vShadowCoord;
in vec3 vWorldPos;

out vec4 fragColor;

uniform mat4 uModel;
uniform vec4 uColor;
uniform sampler2D uTex;
uniform sampler2D uShadowMap;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uShadowBias;
uniform vec3 colors[10];
uniform float time;
uniform float uWire;

// All components are in the range [0\u20261], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0\u20261], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = colors[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = colors[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

// R dither mask
float intensity(vec2 pixel) {
    const float a1 = 0.75487766624669276;
    const float a2 = 0.569840290998;
    //const float a1 = 0.75;
    //const float a2 = 0.25;
    return fract(a1 * pixel.x + a2 * pixel.y);
}

//interleaved gradient noise
float IGN(vec2 coords) {
    return mod(52.9829189 * mod(0.06711056 * float(coords.x) + 0.00583715 * float(coords.y), 1.0), 1.0);
}

float dither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (2.0/grey) * (IGN(coords)) + color - (1.0/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

//map range
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float calculateShadow(vec4 shadowCoord, float bias) {
    // Perspective divide
    vec3 projCoords = shadowCoord.xyz / shadowCoord.w;
    
    // Check if we're in shadow map bounds
    if (projCoords.x < 0.0 || projCoords.x > 1.0 ||
        projCoords.y < 0.0 || projCoords.y > 1.0 ||
        projCoords.z > 1.0) {
        return 1.0; // Outside shadow map, fully lit
    }
    
    // Get depth from shadow map
    float shadowDepth = texture(uShadowMap, projCoords.xy).r;
    
    // Current fragment depth with bias
    float currentDepth = projCoords.z + bias;
    
    // Compare depths
    return currentDepth > shadowDepth ? 0.0 : 1.0;
}

void main() {
    vec3 lightDir = normalize(uLightDirection);

    //for flat shading
    vec3 U = dFdx(vWorldPos);                     
    vec3 V = dFdy(vWorldPos);                 
    vec3 normal = normalize(cross(U,V));
    vec4 tex = texture(uTex, vUV*1.0);
    vec4 dots = texture(uTex, vUV*10.0);

    // Calculate diffuse lighting
    float diff = dot(normal, lightDir) * 0.5 + 0.5;
    
    // Calculate shadow
    float shadow = calculateShadow(vShadowCoord, uShadowBias);
    
    // Combine lighting with shadow
    float lighting = diff * shadow * uLightIntensity;
    
    // Add small ambient so shadows aren't pure black
    lighting = max(lighting, 0.1);

    float greyLvl = 2.0; // Number of gray levels
    vec2 xyPos = gl_FragCoord.xy;
    vec3 col = vec3(
        dither(xyPos, lighting , greyLvl), 
        dither(xyPos, lighting , greyLvl), 
        dither(xyPos, lighting , greyLvl)
    );

    // Calculate fog based on fragment depth
    float depth = gl_FragCoord.z / gl_FragCoord.w;  // Linear depth
    float fogFactor = smoothstep(15.0, 25.0, depth);
    
    // Dither the fog factor instead of smooth blend
    float ditheredFog = dither(xyPos, fogFactor, greyLvl);
    //float ditheredFog = bayer4x4(xyPos, fogFactor);
    
    // Mix fragment color with fog color using dithered fog
    vec3 fogColor = vec3(0.0, 0.0, 0.0);
    vec3 finalColor = mix(tex.rgb, fogColor, ditheredFog);

    if (uWire == 0.0) {
        // Apply lighting to texture
        //fragColor = vec4(1.0, 1.0, 1.0, 1.0);
        //fragColor = vec4(closestColor(vec3(iColor)*lighting) * lighting, 1.0-ditheredFog);
        fragColor = vec4(closestColor(tex.rgb * iColor.rgb * 1.5), 1.0-ditheredFog);
    } else {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0);
        //fragColor = vec4(closestColor(vec3(lighting)), 1.0);
        //fragColor = vec4(dots.rgb, 1.0);
    }
}
`,Mo=`#version 300 es

precision highp float;

in vec4 vColor;
in vec4 iColor;
in vec3 vNormal;
in vec3 vPos;
in vec2 vUV;
in vec4 vShadowCoord;
in vec3 vWorldPos;

out vec4 fragColor;

uniform mat4 uModel;
uniform vec4 uColor;
uniform sampler2D uTex;
uniform sampler2D uShadowMap;
uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uShadowBias;
uniform vec3 colors[10];
uniform float time;
uniform float uWire;

// All components are in the range [0\u20261], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0\u20261], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = colors[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = colors[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

// R dither mask
float intensity(vec2 pixel) {
    const float a1 = 0.75487766624669276;
    const float a2 = 0.569840290998;
    //const float a1 = 0.75;
    //const float a2 = 0.25;
    return fract(a1 * pixel.x + a2 * pixel.y);
}

//interleaved gradient noise
float IGN(vec2 coords) {
    return mod(52.9829189 * mod(0.06711056 * float(coords.x) + 0.00583715 * float(coords.y), 1.0), 1.0);
}

float dither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (2.0/grey) * (IGN(coords)) + color - (1.0/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

// 2x2 Bayer matrix dithering
float bayer2x2(vec2 pixel, float brightness, float grey) {
    // 2x2 Bayer matrix (normalized to 0-1)
    float bayerMatrix[4] = float[4](
        0.0,  0.5,
        0.75, 0.25
    );
    
    int x = int(mod(pixel.x, 2.0));
    int y = int(mod(pixel.y, 2.0));
    int index = x + y * 2;
    
    float threshold = bayerMatrix[index];
    return brightness > threshold ? 1.0 : 0.0;
}

// 4x4 Bayer matrix dithering
float bayer4x4(vec2 pixel, float brightness, float grey) {
    // 4x4 Bayer matrix (normalized to 0-1)
    float bayerMatrix[16] = float[16](
        0.0,    0.5,    0.125,  0.625,
        0.75,   0.25,   0.875,  0.375,
        0.1875, 0.6875, 0.0625, 0.5625,
        0.9375, 0.4375, 0.8125, 0.3125
    );
    
    int x = int(mod(pixel.x, 4.0));
    int y = int(mod(pixel.y, 4.0));
    int index = x + y * 4;
    
    float threshold = bayerMatrix[index];
    return brightness > threshold ? 1.0 : 0.0;
}

//map range
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float calculateShadow(vec4 shadowCoord, float bias) {
    // Perspective divide
    vec3 projCoords = shadowCoord.xyz / shadowCoord.w;
    
    // Check if we're in shadow map bounds
    if (projCoords.x < 0.0 || projCoords.x > 1.0 ||
        projCoords.y < 0.0 || projCoords.y > 1.0 ||
        projCoords.z > 1.0) {
        return 1.0; // Outside shadow map, fully lit
    }
    
    // Get depth from shadow map
    float shadowDepth = texture(uShadowMap, projCoords.xy).r;
    
    // Current fragment depth with bias
    float currentDepth = projCoords.z + bias;
    
    // Compare depths
    return currentDepth > shadowDepth ? 0.0 : 1.0;
}

void main() {
    vec3 lightDir = normalize(uLightDirection);

    //for flat shading
    vec3 U = dFdx(vWorldPos);                     
    vec3 V = dFdy(vWorldPos);                 
    vec3 normal = normalize(cross(U,V));
    vec4 tex = texture(uTex, vUV*1.0);
    vec4 dots = texture(uTex, vUV*10.0);

    // Calculate diffuse lighting
    float diff = dot(normal, lightDir) * 0.5 + 0.5;
    
    // Calculate shadow
    float shadow = calculateShadow(vShadowCoord, uShadowBias);
    
    // Combine lighting with shadow
    float lighting = diff * shadow * uLightIntensity;
    
    // Add small ambient so shadows aren't pure black
    lighting = max(lighting, 0.1);

    float greyLvl = 2.0; // Number of gray levels
    vec2 xyPos = gl_FragCoord.xy;
    vec3 col = vec3(
        bayer4x4(xyPos, iColor.r*lighting , greyLvl), 
        bayer4x4(xyPos, iColor.g*lighting , greyLvl), 
        bayer4x4(xyPos, iColor.b*lighting , greyLvl)
    );

    // Calculate fog based on fragment depth
    float depth = gl_FragCoord.z / gl_FragCoord.w;  // Linear depth
    float fogFactor = smoothstep(20.0, 35.0, depth);

    float height = gl_FragCoord.y;
    float mtnFactor = smoothstep(0.0, 35.0, height);
    
    // Dither the fog factor instead of smooth blend
    float ditheredFog = bayer4x4(xyPos, fogFactor, greyLvl);
    //float ditheredFog = bayer4x4(xyPos, fogFactor);
    
    // Mix fragment color with fog color using dithered fog
    vec3 fogColor = vec3(0.0, 0.0, 0.0);
    vec3 finalColor = mix(tex.rgb, fogColor, ditheredFog);

    if (uWire == 0.0) {
        // Apply lighting to texture
        //fragColor = vec4(0.0, 1.0, 1.0, 1.0);
        fragColor = vec4(closestColor(vec3(col)+vec3(0.0, (vWorldPos.y)*0.0, 0.0)), 1.0-ditheredFog);
    } else {
        fragColor = vec4(1.0, 1.0, 1.0, 1.0-ditheredFog);
        //fragColor = vec4(closestColor(vec3(lighting)), 1.0);
        //fragColor = vec4(dots.rgb, 1.0);
    }
}
`,yo=`#version 300 es
precision highp float;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;
layout(location = 3) in vec4 aColor;
layout(location = 4) in vec3 aInstancePosition;
layout(location = 5) in vec4 aInstanceRotation;
layout(location = 6) in vec3 aInstanceScale;
layout(location = 7) in vec4 aInstanceColor;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform mat4 uTextureMatrix;
uniform vec2 uScreenSize;
uniform float time;

out vec4 vColor;
out vec4 iColor;
out vec3 vNormal;
out vec3 vPos;
out vec2 vUV;
out vec4 vShadowCoord;
out vec3 vWorldPos;
out vec2 vPixelPos;

// Quaternion rotation function
mat4 quatToMat4(vec4 q) {
    float x = q.x, y = q.y, z = q.z, w = q.w;
    float x2 = x + x, y2 = y + y, z2 = z + z;
    float xx = x * x2, xy = x * y2, xz = x * z2;
    float yy = y * y2, yz = y * z2, zz = z * z2;
    float wx = w * x2, wy = w * y2, wz = w * z2;
    
    return mat4(
        1.0 - (yy + zz), xy + wz, xz - wy, 0.0,
        xy - wz, 1.0 - (xx + zz), yz + wx, 0.0,
        xz + wy, yz - wx, 1.0 - (xx + yy), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

void main() {
    // Build instance transform matrix
    mat4 rotation = quatToMat4(aInstanceRotation);
    mat4 scale = mat4(
        aInstanceScale.x, 0.0, 0.0, 0.0,
        0.0, aInstanceScale.y, 0.0, 0.0,
        0.0, 0.0, aInstanceScale.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
    mat4 translation = mat4(
        1.0, 0.0, 0.0, 0.0,
        0.0, 1.0, 0.0, 0.0,
        0.0, 0.0, 1.0, 0.0,
        aInstancePosition.x, aInstancePosition.y, aInstancePosition.z, 1.0
    );

    mat4 billboardView = mat4(
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        //vec4(0.0, 0.0, 0.0, 1.0)
        uView[3]  // keep translation
    );
    
    // Combine: Translation * Rotation * Scale
    mat4 instanceMatrix = translation * rotation * scale;
    mat4 finalModel = uModel * instanceMatrix;
    
    vec4 worldPosition = finalModel * vec4(aPosition, 1.0);
    vWorldPos = worldPosition.xyz;

    //gl_Position = uProjection * billboardView * worldPosition;

    //gl_Position = vec4(aPosition.xzy, 1.0);

    vec4 screenTransform = vec4(2.0 / uScreenSize.x, -2.0 / uScreenSize.y, -1.0, 1.0);
    gl_Position  = vec4(worldPosition.xz * screenTransform.xy + screenTransform.zw, 0.0, 1.0);

    gl_PointSize = 2.0;
    
    //varyings
    vPixelPos = worldPosition.xz;
    vColor = aColor * aInstanceColor;
    iColor = aInstanceColor;
    vNormal = (finalModel * vec4(aNormal, 0.0)).xyz;
    vPos = vec3(aInstancePosition.xyz);
    vUV = aUV;
    vShadowCoord = uTextureMatrix * worldPosition;
}
`,Ao=`#version 300 es
precision highp float;

in vec4 vColor;
in vec4 iColor;
in vec3 vNormal;
in vec3 vPos;
in vec2 vUV;
in vec4 vShadowCoord;
in vec3 vWorldPos;
in vec2 vPixelPos;

out vec4 fragColor;

uniform mat4 uModel;
uniform vec4 uColor;
uniform sampler2D uTex;
uniform sampler2D uShadowMap;
uniform vec2 uScreenSize;

uniform vec3 uLightDirection;
uniform vec3 uLightColor;
uniform float uLightIntensity;
uniform float uShadowBias;
uniform vec3 colors[10];
uniform float uTime;
uniform float uWire;

//map range
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
  
  // Each 8x8 tile samples the full texture
  vec2 tileSize = vec2(8.0);
  vec2 uvInTile = fract(vPixelPos / tileSize); // 0-1 within each 8x8 tile
  
  //fragColor = texture(uTex, uvInTile);

  float ci = vPos.y - 32.0; // offset from space
  float cu = mod(ci, 16.0);
  float cv = floor(ci / 16.0);
  vec2 charUV = (vec2(cu, cv) + uvInTile) * vec2(8.0/128.0, 8.0/64.0);
  vec4 col = texture(uTex, charUV);

  fragColor = col;
}
`,wo=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;
layout(location = 3) in vec4 color;
layout(location = 4) in vec3 instancePosition;
layout(location = 5) in vec4 instanceRotation;
layout(location = 6) in vec3 instanceScale;
layout(location = 7) in vec4 instanceColor;
layout(location = 8) in float aMove;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform float uTime;

out vec4 vColor;
out vec4 iColor;
out vec3 vNormal;
out vec3 vPos;
out vec2 vUV;

// Quaternion rotation function
vec3 rotateVector(vec4 q, vec3 v) {
    vec3 qv = q.xyz;
    float qs = q.w;
    return v + 2.0 * cross(qv, cross(qv, v) + qs * v);
}

void main() {
  // Apply instance transformations

  vec3 osc = vec3(
  mod(uTime * 20.0 + aPosition.y + aPosition.z + instanceColor.x, 4.0),//(uTime * 10.5 + aPosition.x + instanceColor.x * 6.28) * 0.5,
  0.0,//sin(uTime * 54.5 + aPosition.x * 3.141 + instanceColor.x * uTime * 2.0) * 0.15,
  0.0//sin(uTime * 20.5 + aPosition.x + instanceColor.x * 6.28) * 0.5
  );

  vec3 pos = aPosition - osc;

  vec3 transformed = pos * instanceScale;
  transformed = rotateVector(instanceRotation, transformed);
  transformed += instancePosition;

  gl_Position = uProjection * uView * uModel * vec4(transformed, 1.0);
  gl_PointSize = 4.0;

  // Transform normal by rotation quaternion
  vNormal = rotateVector(instanceRotation, aNormal);

  vPos = transformed;
  vUV = aUV;
  vColor = color;
  iColor = instanceColor;
}
`,Po=`#version 300 es

precision highp float;

in vec4 vColor;
in vec4 iColor;
in vec3 vNormal;
in vec3 vPos;
in vec2 vUV;

out vec4 fragColor;

uniform mat4 uModel;
uniform vec4 uColor;
uniform sampler2D uTex;
uniform vec3 colors[10];
uniform float uTime;
uniform float uWire;

// All components are in the range [0\u20261], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0\u20261], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = colors[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = colors[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

// R dither mask
float intensity(vec2 pixel) {
    const float a1 = 0.75487766624669276;
    const float a2 = 0.569840290998;
    //const float a1 = 0.75;
    //const float a2 = 0.25;
    return fract(a1 * pixel.x + a2 * pixel.y);
}

//interleaved gradient noise
float IGN(vec2 coords) {
    return mod(52.9829189 * mod(0.06711056 * float(coords.x) + 0.00583715 * float(coords.y), 1.0), 1.0);
}

float dither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (2.0/grey) * (IGN(coords)) + color - (1.0/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

//map range
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
    vec3 lightDir = normalize(vec3(-1.0, 1.0, -1.0));
    //vec3 lightDir = normalize(mat3(uModel) * vec3(1.0, 1.0, 1.0));

    //for flat shading
    vec3 U = dFdx(vPos);                     
    vec3 V = dFdy(vPos);                 
    vec3 normal = normalize(cross(U,V));

    vec4 tex = texture(uTex, vUV);//gl_PointCoord.xy

    //vec3 normal = normalize(vNormal);
    float diff = dot(normal, lightDir) * 0.5 + 0.5;

    float greyLvl = 2.0; // Number of gray levels
    vec2 xyPos = gl_FragCoord.xy;
    //vec3 col = vec3(dither(xyPos, diff*uColor.r, greyLvl), dither(xyPos, diff*uColor.g, greyLvl), dither(xyPos, diff*uColor.b, greyLvl));

    //vec3 col = vec3(dither(xyPos, tex.r, greyLvl), dither(xyPos, tex.g, greyLvl), dither(xyPos, tex.b, greyLvl));
    //col.rgb = pow(col, vec3(1.0/2.2));

    //float r = map( ((mod(vColor.r, 6.28318530718) / 6.28318530718) * 2.0 - 1.0), 0.0, 1.0, 0.0, 256.0);
    float r = map(vColor.r, 0.0, 255.0, 0.0, 256.0);
    float x = mod(r, 256.0); //0, 255
    float y = 0.0;
    float idx = floor(x / 8.0) * 8.0;
    float idy = floor(y / 8.0) * 8.0;
    vec4 col = texture(uTex, vUV / vec2(32.0, 1.0) + (vec2(idx, idy) / vec2(256.0, 8.0)));

    if (uWire == 0.0) {
      //face
      //fragColor = vec4(closestColor(iColor.rgb * vColor.rgb), 1.0);
      fragColor = vec4(tex.rgb, 1.0);
    } else {
      //outline
      //fragColor = vec4(0.0, 0.0, 0.0, 1.0);
      fragColor = vec4(closestColor(vColor.rgb * 2.0), 1.0);
    }
}
`,bo=`#version 300 es
layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;
layout(location = 2) in vec2 aUV;
layout(location = 3) in vec4 color;
layout(location = 4) in vec3 instancePosition;
layout(location = 5) in vec4 instanceRotation;
layout(location = 6) in vec3 instanceScale;
layout(location = 7) in vec4 instanceColor;
layout(location = 8) in float aMove;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;
uniform float uTime;
uniform float uLifetime;   // total explosion duration in seconds
uniform float uStartTime;  // time the explosion was triggered

out vec4 vColor;
out vec4 iColor;
out vec3 vNormal;
out vec3 vPos;
out vec2 vUV;
out float vAlpha;

vec3 rotateVector(vec4 q, vec3 v) {
    vec3 qv = q.xyz;
    float qs = q.w;
    return v + 2.0 * cross(qv, cross(qv, v) + qs * v);
}

// Cheap hash: seed -> pseudo-random float in [-1, 1]
float hash(float n) {
    return fract(sin(n) * 43758.5453) * 2.0 - 1.0;
}

void main() {

  // float t = clamp((uTime - uStartTime) / uLifetime, 0.0, 1.0);

  // --- Per-instance unique seed from instanceColor ---
  float seed = instanceColor.x * 127.3 + instanceColor.y * 311.7 + instanceColor.z * 74.1;
  
  float phase  = fract(hash(seed + 0.9) * 0.5 + 0.5); // [0..1] per instance
  float t      = mod((uTime - uStartTime) / uLifetime + phase, 1.0);

  // --- Random outward direction (not normalized so magnitude varies) ---
  vec3 dir = vec3(
    hash(seed + 0.1),
    hash(seed + 0.2),
    hash(seed + 0.3)
  );
  // Bias upward slightly for a natural burst shape
  dir.y += 0.94;
  dir = normalize(dir);

  // --- Speed: fast initial burst, eases out ---
  float speed = mix(3.0, 8.0, hash(seed + 0.4) * 0.5 + 0.5);
  float dist  = speed * t * t * (3.0 - 2.0 * t); // smoothstep easing

  // --- Gravity: pulls down over time ---
  float gravity = 9.0;
  vec3 gravityVec = vec3(0.0, -gravity * t * t, 0.0);

  // --- Per-particle tumble: spin around a random axis ---
  float spinRate  = mix(2.0, 8.0, hash(seed + 0.5) * 0.5 + 0.5);
  float spinAngle = spinRate * t * 6.2832;
  vec3  spinAxis  = normalize(vec3(hash(seed + 0.6), hash(seed + 0.7), hash(seed + 0.8)));
  // Rodrigues rotation
  float cosA = cos(spinAngle);
  float sinA = sin(spinAngle);
  vec3 tumbled = aPosition * cosA
               + cross(spinAxis, aPosition) * sinA
               + spinAxis * dot(spinAxis, aPosition) * (1.0 - cosA);

  // --- Fade out toward end of lifetime ---
  float alpha = 1.0 - smoothstep(0.6, 1.0, t);

  // --- Assemble ---
  vec3 pos = tumbled * instanceScale;
  pos = rotateVector(instanceRotation, pos);
  pos += instancePosition + dir * dist + gravityVec;

  gl_Position  = uProjection * uView * uModel * vec4(pos-vec3(0.1, 0.0, 0.0), 1.0);
  gl_PointSize = mix(6.0, 1.0, t);   // shrink as they fly out

  vNormal = rotateVector(instanceRotation, aNormal);
  vPos    = pos;
  vUV     = aUV;
  vColor  = color;
  iColor  = instanceColor;
  vAlpha  = alpha;
}
`,To=`#version 300 es

precision highp float;

in vec4 vColor;
in vec4 iColor;
in vec3 vNormal;
in vec3 vPos;
in vec2 vUV;
in float vAlpha;

out vec4 fragColor;

uniform mat4 uModel;
uniform vec4 uColor;
uniform sampler2D uTex;
uniform vec3 colors[10];
uniform float uTime;
uniform float uWire;

// All components are in the range [0\u20261], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0\u20261], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = colors[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = colors[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

// R dither mask
float intensity(vec2 pixel) {
    const float a1 = 0.75487766624669276;
    const float a2 = 0.569840290998;
    //const float a1 = 0.75;
    //const float a2 = 0.25;
    return fract(a1 * pixel.x + a2 * pixel.y);
}

//interleaved gradient noise
float IGN(vec2 coords) {
    return mod(52.9829189 * mod(0.06711056 * float(coords.x) + 0.00583715 * float(coords.y), 1.0), 1.0);
}

float dither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (2.0/grey) * (IGN(coords)) + color - (1.0/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

//map range
float map(float value, float inMin, float inMax, float outMin, float outMax) {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

void main() {
    vec3 lightDir = normalize(vec3(-1.0, 1.0, -1.0));
    //vec3 lightDir = normalize(mat3(uModel) * vec3(1.0, 1.0, 1.0));

    //for flat shading
    vec3 U = dFdx(vPos);                     
    vec3 V = dFdy(vPos);                 
    vec3 normal = normalize(cross(U,V));

    vec4 tex = texture(uTex, vUV);//gl_PointCoord.xy

    //vec3 normal = normalize(vNormal);
    float diff = dot(normal, lightDir) * 0.5 + 0.5;

    float greyLvl = 2.0; // Number of gray levels
    vec2 xyPos = gl_FragCoord.xy;
    //vec3 col = vec3(dither(xyPos, diff*uColor.r, greyLvl), dither(xyPos, diff*uColor.g, greyLvl), dither(xyPos, diff*uColor.b, greyLvl));

    //vec3 col = vec3(dither(xyPos, tex.r, greyLvl), dither(xyPos, tex.g, greyLvl), dither(xyPos, tex.b, greyLvl));
    //col.rgb = pow(col, vec3(1.0/2.2));

    //float r = map( ((mod(vColor.r, 6.28318530718) / 6.28318530718) * 2.0 - 1.0), 0.0, 1.0, 0.0, 256.0);
    float r = map(vColor.r, 0.0, 255.0, 0.0, 256.0);
    float x = mod(r, 256.0); //0, 255
    float y = 0.0;
    float idx = floor(x / 8.0) * 8.0;
    float idy = floor(y / 8.0) * 8.0;
    vec4 col = texture(uTex, vUV / vec2(32.0, 1.0) + (vec2(idx, idy) / vec2(256.0, 8.0)));

    if (uWire == 0.0) {
      //face
      //fragColor = vec4(closestColor(iColor.rgb * vColor.rgb), 1.0);
      fragColor = vec4(closestColor(vec3(0.95)), iColor.a * vAlpha);
    } else {
      //outline
      //fragColor = vec4(0.0, 0.0, 0.0, 1.0);
      fragColor = vec4(closestColor(vColor.rgb * 2.0), iColor.a * vAlpha);
    }
}
`,Eo=`#version 300 es
in vec4 position;
void main() {
  gl_Position = position;
}
`,Ro=`#version 300 es
precision highp float;

uniform sampler2D uPositionTex;
uniform sampler2D uVelocityTex;
uniform sampler2D uInitPositionsTex;
uniform sampler2D uGridPositions;
uniform vec3 bounds;
uniform float deltaTime;
uniform float time;

out vec4 outColor;

//	Simplex 4D Noise 
//	by Ian McEwan, Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

// Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
            i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
          + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
          + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
          + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
              + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}

// Curl noise function - creates divergence-free vector field
vec3 curlNoise(vec3 p) {
    const float eps = 0.1;
    
    // Use different seeds/offsets for each component to avoid correlation
    float n_x1 = snoise(vec4(p + vec3(eps, 0.0, 0.0), time * 0.01));
    float n_x2 = snoise(vec4(p - vec3(eps, 0.0, 0.0), time * 0.01));
    float n_y1 = snoise(vec4(p + vec3(0.0, eps, 0.0), time * 0.01 + 100.0));
    float n_y2 = snoise(vec4(p - vec3(0.0, eps, 0.0), time * 0.01 + 100.0));
    float n_z1 = snoise(vec4(p + vec3(0.0, 0.0, eps), time * 0.01 + 200.0));
    float n_z2 = snoise(vec4(p - vec3(0.0, 0.0, eps), time * 0.01 + 200.0));
    
    // Cross derivatives for curl calculation
    float n_xy1 = snoise(vec4(p + vec3(0.0, eps, 0.0), time * 0.01 + 300.0));
    float n_xy2 = snoise(vec4(p - vec3(0.0, eps, 0.0), time * 0.01 + 300.0));
    float n_xz1 = snoise(vec4(p + vec3(0.0, 0.0, eps), time * 0.01 + 400.0));
    float n_xz2 = snoise(vec4(p - vec3(0.0, 0.0, eps), time * 0.01 + 400.0));
    float n_yz1 = snoise(vec4(p + vec3(eps, 0.0, 0.0), time * 0.01 + 500.0));
    float n_yz2 = snoise(vec4(p - vec3(eps, 0.0, 0.0), time * 0.01 + 500.0));
    
    vec3 curl;
    curl.x = (n_z1 - n_z2) - (n_xy1 - n_xy2);
    curl.y = (n_yz1 - n_yz2) - (n_xz1 - n_xz2);
    curl.z = (n_y1 - n_y2) - (n_x1 - n_x2);
    
    return curl / (2.0 * eps);
}

vec3 clampAngleSpherical(vec3 coord, float azimuthSteps, float elevationSteps) {
  float r = length(coord);
  if (r == 0.0) return coord;
  
  // Convert to spherical coordinates
  float azimuth = atan(coord.z, coord.x);  // Horizontal angle (around Y axis)
  float elevation = asin(coord.y / r);     // Vertical angle (up/down)
  
  // Clamp angles
  float azimuthAngle = 3.14159 * 2.0 / azimuthSteps;
  float elevationAngle = 3.14159 / elevationSteps;
  
  float newAzimuth = floor(azimuth / azimuthAngle + 0.5) * azimuthAngle;
  float newElevation = floor(elevation / elevationAngle + 0.5) * elevationAngle;
  
  // Convert back to Cartesian
  float cosElev = cos(newElevation);
  vec3 result = vec3(
      cos(newAzimuth) * cosElev,
      sin(newElevation),
      sin(newAzimuth) * cosElev
  ) * r;
  
  return result;
}

vec3 clampToDirections(vec3 coord, int numDirections) {
    if (length(coord) == 0.0) return coord;
    
    vec3 normalized = normalize(coord);
    float bestDot = -2.0;
    vec3 bestDirection = vec3(1.0, 0.0, 0.0);
    
    // Check against evenly distributed directions on sphere
    for (int i = 0; i < numDirections; i++) {
        float theta = float(i) * 3.1415 * 2.0 / float(numDirections);
        vec3 direction = vec3(cos(theta), 0.0, sin(theta));
        
        float dot = dot(normalized, direction);
        if (dot > bestDot) {
            bestDot = dot;
            bestDirection = direction;
        }
    }
    
    return bestDirection * length(coord);
}

float insideBox(vec3 v, vec3 minCorner, vec3 maxCorner) {
  vec3 s = step(minCorner, v) - step(maxCorner, v);
  return s.x * s.y * s.z;   
}

float insideSphere(vec3 v, vec3 center, float r) {
   vec3 offset = v - center;
   return step(dot(offset, offset), r * r);
}

vec3 euclideanModulo(vec3 n, vec3 m) {
  return mod(mod(n, m) + m, m);
}

void main() {
  ivec2 texelCoord = ivec2(gl_FragCoord.xy);
  
  vec3 position = texelFetch(uPositionTex, texelCoord, 0).xyz;
  vec3 velocity = texelFetch(uVelocityTex, texelCoord, 0).xyz;

  vec3 initPosition = texelFetch(uInitPositionsTex, texelCoord, 0).xyz;
  vec3 gridPosition = texelFetch(uGridPositions, texelCoord, 0).xyz;

  float len = distance(vec3(0.0), position)*2.0;

  vec3 attract = (position - initPosition);
  float dist = length(attract);
  vec3 dir = normalize(attract);
  // Non-linear spring - stronger pull when further away
  float strength = dist * dist * 0.05;
  vec3 target = attract;//dir * strength;

  vec3 grid = (position - gridPosition);

  float dist2 = length(grid);
  // Tangential force for orbiting
  vec3 tangent = cross(grid, vec3(0.0, 1.0, 0.0));
  tangent = normalize(tangent);

  // float dist2 = length(grid);
  vec3 dir2 = normalize(grid);
  float strength2 = dist2 * dist2 * 0.05;

  vec3 attractGrid = dir2 * strength2;

  vec3 offset = vec3(99.0, 213.0, 82.0);

  // Add curl noise to velocity
  float noiseScale = 0.015;   // Controls frequency of curl noise
  float noiseStrength = 5.95; // Controls strength of curl effect
  
  vec3 noiseInput = position * noiseScale;
  vec3 curlVelocity = clampAngleSpherical(curlNoise(noiseInput) * noiseStrength, 30.0, 30.0);

  tangent = curlVelocity;

  //vec3 curlVelocity = curlNoise(noiseInput) * noiseStrength;

  float nx = snoise(vec4(noiseInput.x, noiseInput.y, noiseInput.z, time*0.01)) * noiseStrength;
  float ny = snoise(vec4(noiseInput.x, noiseInput.y+99.0, noiseInput.z, time*0.01)) * noiseStrength;
  float nz = snoise(vec4(noiseInput.x, noiseInput.y, noiseInput.z-99.0, time*0.01)) * noiseStrength;
  
  // Combine base velocity with noise
  vec3 finalVelocity;// = velocity + vec3(nx, ny + curlVelocity.y + 100.0, nz);
  
  vec3 newPosition = vec3(0.0);
  vec3 force = vec3(0.0, 0.0, 0.0);

  float x = floor(position.x * 10.0)/10.0;
  float y = floor(position.y * 10.0)/10.0;
  float z = floor(position.z * 10.0)/10.0;

  force.y -= 20.0;

    float step = step(0.5, fract(time / 125.0));

    if (step == 0.0) {
      //force -= (target)*1.0;
      //force += tangent * dist * 2.5; // Orbital motion
      force += curlVelocity;

    } else {
      //force -= (attractGrid)*3.0;
      force += curlVelocity;
      //force += vec3(0.0, -4.0, 0.0);
      //force -= grid * 1.0; // Pull toward center
      //force += tangent * dist * 0.5; // Orbital motion
      //force -= velocity * 0.93; // Damping
    }

  finalVelocity = 0.0 * velocity + force;// + curlVelocity * 0.1;
  newPosition = euclideanModulo((position + finalVelocity * deltaTime)+bounds/2.0, bounds) - bounds / 2.0;

  // Update position with wrap-around

  outColor = vec4(newPosition, 1.0);
  }
`,Co=`#version 300 es
uniform sampler2D uPositionTex;
uniform sampler2D uColorTex;  // Add this

uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uModel;
uniform float uPointSize;

out vec3 pos;
out vec3 lightDir;
out float particleId;
out vec4 particleColor;
out vec3 worldPos;

vec4 getValueFrom2DTextureAs1DArray(sampler2D tex, ivec2 dimensions, int index) {
  int y = index / dimensions.x;
  int x = index % dimensions.x;
  return texelFetch(tex, ivec2(x, y), 0);
}

void main() {
  ivec2 texDimensions = textureSize(uPositionTex, 0);
  vec4 position = getValueFrom2DTextureAs1DArray(uPositionTex, texDimensions, gl_VertexID);
  pos = position.xyz / 4.0;
  vec4 light = vec4(1.0, -1.0, 1.0, 1.0) * uProjection * uView * uModel;
  lightDir = light.xyz;

  vec4 color = getValueFrom2DTextureAs1DArray(uColorTex, texDimensions, gl_VertexID);

  vec4 vWorldPos = uProjection * uView * uModel * vec4(position.xyz, 1);
  worldPos = vWorldPos.xyz;

  gl_Position = uProjection * uView * uModel * vec4(position.xyz, 1);
  gl_PointSize = uPointSize * (16.0 - worldPos.z);
  particleId = float(gl_VertexID);
  particleColor = color;

}
`,zo=`#version 300 es
precision highp float;
uniform vec3 colors[10];

in vec3 pos;
in vec3 lightDir;
in float particleId;
in vec4 particleColor;
in vec3 worldPos;
out vec4 outColor;

// All components are in the range [0\u20261], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0\u20261], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = colors[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = colors[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

//interleaved gradient noise
float IGN(vec2 coords) {
    return mod(52.9829189 * mod(0.06711056 * float(coords.x) + 0.00583715 * float(coords.y), 1.0), 1.0);
}

float dither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (2.0/grey) * (IGN(coords)) + color - (1.0/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

void main() {
  // Create circular particles
  //vec2 coord = gl_PointCoord - vec2(0.5);
  //float dist = length(coord);
  //if (dist < 0.25) discard;
  
  // Color based on position for depth perception
  //float alpha = 1.0 - dist * 2.0;
  float len = distance(vec3(0.0), pos) * 0.5;

  // gl_PointCoord is in [0,1] range
  vec2 coord = gl_PointCoord * 2.0 - 1.0; // [-1,1]
  float dist = dot(coord, coord);
  //if (dist > 1.0) discard; // circular particle

  // Fake a normal as if the point is a sphere
  vec3 normal = normalize(vec3(coord, sqrt(1.0 - dist)));

  vec3 lightD = normalize(lightDir);
  //for flat shading
  // vec3 U = dFdx(pos);
  // vec3 V = dFdy(pos);
  // vec3 normal = normalize(cross(U,V));

  //float diff = dot(pos, lightDir) * 0.5 + 0.5;
  float diff = max(dot(normal, lightD), 0.0);

  vec2 uv = gl_FragCoord.xy / vec2(4.0);

  // Scale to control the number of checks
  float scale = 2.0;
  vec2 check = floor(coord * scale);

  // Checker pattern using mod
  float checker = mod(check.x + mod(check.y, 2.0), 2.0);

  // Output black or white
  vec3 checkerColor = mix(vec3(1.0), vec3(0.0), checker);

  vec2 xyPos = gl_FragCoord.xy;
  vec3 dither = vec3(dither(xyPos, diff, 4.0), dither(xyPos, diff, 4.0), dither(xyPos, diff, 4.0));


  vec3 color = closestColor(vec3(pos.x, pos.y, pos.z)+0.5);
  vec3 color1 = closestColor(fract(abs(pos) * 2.0));
  //outColor = vec4(color, 1);

  float hue = mod(particleId * 0.618034, 1.0); // Golden ratio for good distribution
  vec3 color2 = closestColor(vec3(len));
  vec3 color3 = closestColor(vec3(
    abs(cos(hue * 6.28318 + 0.0)) * 0.8 + 0.2,
    abs(cos(hue * 6.28318 + 2.09440)) * 0.8 + 0.2,
    abs(cos(hue * 6.28318 + 4.18879)) * 0.8 + 0.2
  ));

  //float groupId = mod(particleId, 10.0);
  //vec3 color4 = closestColor(vec3(particleId / 250000.0));

  // float colorPeriod = 500000.0; // change color every 500 particles
  // float colorIndex = mod(particleId, colorPeriod);
  // vec3 color4 = closestColor(vec3(colorIndex / colorPeriod));

  vec3 baseColor = particleColor.rgb;

  float depth = gl_FragCoord.z / gl_FragCoord.w;  // Linear depth
  float fogFactor = smoothstep(0.0, 200.0, depth);

  float groupSize = 500.0;
  float groupId = floor(particleId / groupSize);
  float r = mod(groupId, 4.0) / 4.0;
  float g = mod(groupId * 2.0, 5.0) / 5.0;
  float b = mod(groupId * 3.0, 3.0) / 3.0;
  vec3 color4 = closestColor(vec3(r, g, b));
  //outColor = vec4(closestColor(color4), 1.0);
  outColor = vec4(closestColor(baseColor), 1.0);
  //outColor = vec4(vec3(diff), 1.0);
}
`,G=Vi(10,$fx.rand()*9999),Ee=(e,t)=>(e*e+t*t)**.5,So=(e,t,i)=>(e*e+t*t+i*i)**.5,Ji=(e,t,i)=>Math.min(Math.max(e,t),i),Wi=(e,t)=>e>0&&t>0?Ee(e,t):e>t?e:t,be=(e,t,i,r,n=r,s=r)=>Wi(Math.abs(e)-r,Wi(Math.abs(t)-n,Math.abs(i)-s));function Gi([e,t,i],r){return So(e,t,i)-r}function ki([e,t,i],r){return e=Math.abs(e),t=Math.abs(t),i=Math.abs(i),(e+t+i-r)*.57735027}function Fo([e,t,i],r,n="y",s=1,o=1){let a=h=>h>0?h*o:h*s;n==="x"?e=a(e):n==="y"?t=a(t):n==="z"&&(i=a(i)),e=Math.abs(e),t=Math.abs(t),i=Math.abs(i);let l=Math.max(s,o),c=1/Math.sqrt(2+l*l);return(e+t+i-r)*c}function Hi(e,t,i){let r=Ji(.5+.5*(t-e)/i,0,1);return Si(t,e,r)-i*r*(1-r)}function Io([e,t,i],r,n,s,o){e=Math.abs(e),t=Math.abs(t),i=Math.abs(i);let a=Ji((r*e-n*i+n*n)/(r*r+n*n),0,1),l=e-r*a,c=i-n*(1-a),h=Ee(l,c)*Math.sign(l)-o,f=t-s;return Math.min(Math.max(h,f),0)+Ee(Math.max(h,0),Math.max(f,0))}function $i(e,t,i){let r=Gi([e,t,i],.15),n=Gi([e-1,t,i],.5),s=ki([e*.45,t*4,i],.5),o=Fo([e+1,t*9,i],.05,"x",10,2),a=ki([e,t*2,i],.95),l=Io([e,t,i],.5,.5,.01,.01),c=be(e+0,t+0,i+qi,_i,Yi,.01),h=be(e+0,t+0,i-qi,_i,Yi,.01),f=0;xo>.5?f=Math.min(c,h):f=be(e+1,t-.5,i,.9,.1,.1);let d=t+2,u=Hi(s,o,.05);return Hi(u,f,.5)}var it=document.querySelector("#canvas2D");it.width=window.innerWidth;it.height=window.innerHeight;var tr=it.getContext("2d");tr.imageSmoothingEnabled=!1;var q=document.querySelector("#canvasGL");q.width=it.width/2;q.height=it.height/2;q.style.display="none";var U,ot,_,gt,vt,ne,mt,Bt,ji,at,W=new Rt(30,900),pt=[],Zi=0;document.addEventListener("keydown",Xo);var er=new FontFace("MByte","url(data:font/woff;base64,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)");document.fonts.add(er);er.load().then(()=>{Bt=Bo();let e=Bt.getContext("2d"),t=e.getImageData(0,0,Bt.width,Bt.height);e.putImageData(t,0,0),Uo()},e=>{console.error(e)});function Do(e="checker"){let t=document.createElement("canvas"),i=t.getContext("2d",{alpha:!0});t.style.imageRendering="pixelated",t.style.display="none";let r=8;t.width=r,t.height=r,{checker:a=>{for(let l=0;l<r;l++)for(let c=0;c<r;c++)a.fillStyle=(c+l)%2===0?"#fff":"#000",a.fillRect(c,l,1,1)},stripes:a=>{for(let l=0;l<r;l++)a.fillStyle=l%2===0?"#fff":"#000",a.fillRect(l,0,1,r)},dots:a=>{a.fillStyle="#000",a.fillRect(0,0,r,r);let l=[2,6,2,6],c=[2,2,6,6];a.fillStyle="#fff";for(let h=0;h<4;h++)a.fillRect(l[h],c[h],2,2)}}[e]?.(i);let s=i.getImageData(0,0,r,r),o=s.data;for(let a=0;a<o.length;a+=4)o[a]=Math.round(o[a]/255)*255,o[a+1]=Math.round(o[a+1]/255)*255,o[a+2]=Math.round(o[a+2]/255)*255,o[a+3]=Math.floor(o[a+3]/255)*255;return i.putImageData(s,0,0),t}function Bo(){let e=document.createElement("canvas");e.width=128,e.height=64;let t=e.getContext("2d");t.fillStyle="#000",t.fillRect(0,0,128,64),t.clearRect(0,0,128,64),t.fillStyle="#fff",t.font="8px MByte",t.textBaseline="top";for(let n=0;n<96;n++){let s=String.fromCharCode(32+n),o=n%16*8,a=Math.floor(n/16)*8;t.fillText(s,o,a)}let i=t.getImageData(0,0,e.width,e.height),r=i.data;for(let n=0;n<r.length;n+=4)r[n]=Math.round(r[n]/255)*255,r[n+1]=Math.round(r[n+1]/255)*255,r[n+2]=Math.round(r[n+2]/255)*255,r[n+3]=Math.floor(r[n+3]/255)*255;return t.putImageData(i,0,0),e}var Lt=new zt,ct=kt.generate({numWaypoints:16,minRadius:15,maxRadius:45,straightProbability:.05,roughness:.9,amplitude:mo,rfunc:$fx.rand});ct.translate([0,1,0]);var se=ct.subdivideByStep(.005),J=Yo();for(let e=0;e<se.length-1;e++)Lt.addPolyline([se[e],se[e+1]],[1,1,1,1],[1,1]);Lt.addInstance([0,0,0],[0,0,0,1],[1,1,1],[0,0,0,1]);var Mt=new St(300,300,200,200,{uvScale:32});Mt.applyNoiseAvoidingSpline(Re,po,uo,se,4);var ir=new ie(Mt,512);Mt.addInstance([0,0,0],[0,0,0,1],[1,1,1],[$fx.rand(),$fx.rand(),$fx.rand(),1]);var k=new Kt({xMin:-3,xMax:3,xStep:.75,yMin:-3,yMax:3,yStep:.75,zMin:-3,zMax:3,zStep:.75},2),Vo={surfaceFunc:$i};k.updateVolume(Vo);k.generateMesh(.5);k.addInstance([0,5,0],[0,0,0,1],[.15,.15,.15],[$fx.rand(),$fx.rand(),$fx.rand(),1]);k.addInstance([0,5,0],[0,0,0,1],[.15,.15,.15],[$fx.rand(),$fx.rand(),$fx.rand(),1]);var $=new zt;$.addPolyline([[0,0,0],[2,0,0]],[$fx.rand(),$fx.rand(),$fx.rand(),1],[0,0]);$.addPolyline([[0,-.5,0],[1,-.5,0]],[$fx.rand(),$fx.rand(),$fx.rand(),1],[0,0]);$.addPolyline([[0,.5,0],[1.5,.5,0]],[$fx.rand(),$fx.rand(),$fx.rand(),1],[0,0]);$.addPolyline([[0,-.5,-1],[1,-.5,-1]],[$fx.rand(),$fx.rand(),$fx.rand(),1],[0,0]);$.addPolyline([[0,.5,1],[1.5,.5,1]],[$fx.rand(),$fx.rand(),$fx.rand(),1],[0,0]);$.addInstance([0,0,0],[0,0,0,1],[1,1,1],[1,1,1,1]);var et=new Jt(k,0,[1,0,0]);et.setBounds([-115,-10,-115],[115,100,115]);et.setHeightField(ir,.1,0);var yt=new te;yt.addInstance([0,-1.8,0],[0,0,0,1],[.1,.1,.1],[$fx.rand(),$fx.rand(),$fx.rand(),1]);yt.addInstance([0,-1.8,0],[0,0,0,1],[300,1,300],[$fx.rand(),$fx.rand(),$fx.rand(),1]);var lt=new $t(1,1);for(let e=0;e<20;e++){let t=$fx.rand()*.2;lt.addInstance([0,-300,0],[0,0,0,1],[t,t,t],[$fx.rand(),$fx.rand(),$fx.rand(),1])}var rr={pos:x.create(),prevPos:x.create(),rot:b.create()},nr=ar(0);x.copy(rr.pos,nr.o);x.copy(rr.prevPos,nr.o);var At=new St(8,8,2,2),oe=[],z=new Ui(q,8,8);var X=[.2,1,.3,1],sr=[1,.8,.2,1];if(!(typeof window!=="undefined"&&window.__GAMERS_NO_HUD)){z.crosshair(z.cx,z.cy,3,X,!0);go>.5?z.circle(z.cx,z.cy,16,45,X,!0):z.box(z.cx-16,z.cy-16,32,32,X,!0);z.bracket(2,2,8,5,"tl",X,!0);z.bracket(z.fromRight(9),2,8,5,"tr",X,!0);z.bracket(2,z.fromBottom(6),8,5,"bl",X,!0);z.bracket(z.fromRight(9),z.fromBottom(6),8,5,"br",X,!0);z.vLine(z.fromRight(5),z.cy-10,21,124,sr,!0);z.text(z.fromRight(11),z.cy,"15000",sr,!1);z.hLine(z.cx-12,z.fromBottom(4),25,45,X,!0);z.text(z.cx-5,z.fromBottom(6),"DAMAGE:000",X,!1);z.text(z.cx-10,z.cy+7,"27000000",X,!1);z.text(z.cx-10,z.cy+8,"27000000",X,!1);z.text(z.cx-10,z.cy+9,"27000000",X,!1);z.text(z.cx-10,z.cy+10,"27000000",X,!1);z.text(z.cx-10,z.cy+11,"27000000",X,!1);z.text(z.cx-10,z.cy+12,"27000000",X,!1);}var Te=e=>[...Array(e)].map(()=>Math.floor($fx.rand()*16).toString(16)).join("").toUpperCase(),re=[];function Lo(e,t,i,r,n){if(typeof window!=="undefined"&&window.__GAMERS_NO_HUD)return;$fx.rand()>.1&&(re.push(`0x${Te(4)} +: ${Te(8)} 0x${Te(30)}`),re.length>n-0&&re.shift()),re.forEach((s,o)=>{z.setTextAt(t,i+o,s)})}z.instances.forEach((e,t)=>{let i=new Li(t,128,0),r=0+Math.sqrt(e.col*e.col+e.row*e.row)*3;i.setDelay(r),i.position=[e.x,e.y],e.still==!0&&(i.static=!0,i.current=e.char),oe.push(i),At.addInstance([e.x,t,e.y],[0,0,0,1],[1,1,1],e.color)});var Vt;function Uo(){U=new Ft(q),U.setClearColor(G[3],G[4],G[5],1),ot=new It,_=new Zt(85,1),_.setPosition(3,8,0),_.lookAt([0,0,0],[0,1,0]),at=new Qt([1,1,1],[1,1,1],1),at.castShadow=!0,at.shadowMapSize=2048,at.shadowBias=-.01,at.setShadowCamera([0,5,0],[-.1,0,-.1]),at.setShadowCameraBounds(-100,100,-100,100,.5,3e3),U.setDirectionalLight(at),gt=new H(U.gl,Xi,vo),ji=Do("checker"),vt=new H(U.gl,Xi,Mo);let e=H.createTexture(U.gl,ji);gt.setTexture("uTex",e),gt.setProperty("colors",G),gt.wireframeEnabled=!1,vt.setTexture("uTex",e),vt.setProperty("colors",G),vt.wireframeEnabled=!1,ne=new H(U.gl,wo,Po),ne.setProperty("colors",G),mt=new H(U.gl,bo,To),mt.setProperty("colors",G),mt.setProperty("uTime",0),mt.setProperty("uLifetime",20),mt.setProperty("uStartTime",0);let t=H.createTexture(U.gl,Bt);Vt=new H(U.gl,yo,Ao),Vt.setTexture("uTex",t),Vt.setProperty("uScreenSize",[q.width,q.height]),document.body.style.backgroundColor=`rgb(${G[0]*255}, ${G[1]*255}, ${G[2]*255})`,Lt.prepare(U.gl),Lt.updateInstanceData(U.gl),Mt.initBuffers(U.gl),Mt.updateInstanceData(U.gl),k.initBuffers(U.gl),k.updateInstanceData(U.gl),At.initBuffers(U.gl),At.updateInstanceData(U.gl),yt.initBuffers(U.gl),yt.updateInstanceData(U.gl),$.prepare(U.gl),$.updateInstanceData(U.gl),lt.initBuffers(U.gl),lt.updateInstanceData(U.gl);let i=new Z;i.geometry=Lt,i.material=gt,i.castShadow=!1;let r=new Z;r.geometry=Mt,r.material=vt;let n=new Z;n.geometry=k,n.material=gt,n.castShadow=!0;let s=new Z;s.geometry=yt,s.material=vt;let o=new Z;o.geometry=$,o.material=ne,o.castShadow=!1;let a=new Z;a.geometry=At,a.material=Vt;let l=new Z;l.geometry=lt,l.material=mt,ot.add(r),ot.add(n),ot.add(s),ot.add(o),ot.add(a),ot.add(l),Oo(),or()}var Ce,Ki,No={PVS:Eo,PFS:Ro,drawPVS:Co,drawPFS:zo};function Oo(){let e=U.gl;Ce=new ee(e,No,{width:128,height:128,canvasWidth:q.width,canvasHeight:q.height,gravity:[0,0],damping:.998,wrap:!0,positionRange:[[-150,150],[0,150],[-150,150]],velocityRange:[[-1,1],[-1,1],[-1,1]],sdf:$i,noise:Re,jitter:.02,particlesPerEdge:500})}function _o(e,t){Ki={bounds:[300,300,300],deltaTime:e,time:W.frameStep},Ce.update(e,t,Ki,{canvasWidth:q.width,canvasHeight:q.height,bounds:[300,10,300],updateVelocities:!1})}var Qi=0;function or(e){if(W.stepTime(e),W.delta>W.interval){W.updateTime(e);let t=1e3/30;_o(W.delta/1e3,W.frameStep);let i=D.create();_.modelMatrix=i,at.modelMatrix=i,Zi=W.frameStep/W.totalFrames;let r=ar(Zi);x.normalize(r.dt,r.dt),x.normalize(r.r,r.r),x.normalize(r.n,r.n);let n=bt.fromValues(r.dt[0],r.dt[1],r.dt[2],r.n[0],r.n[1],r.n[2],r.r[0],r.r[1],r.r[2]),s=b.create();b.fromMat3(s,n),b.normalize(s,s);let o=b.create();b.setAxisAngle(o,[1,0,0],Math.PI/2),b.multiply(s,s,o);let a=[r.o[0],r.o[1],r.o[2]],l=r.o;$.updateTransform(0,k.getInstance(0).position,k.getInstance(0).rotation),et.addAttractionForce(l,2,.1),et.setLookAtTarget(l),et.update(t/1e3),yt.updateTransform(0,a,s),k.updateTransform(1,a,s);let c=ir.query(k.getInstance(0).position,.15);if(c){Qi++;for(let m=0;m<lt.instanceCount-1;m++)lt.updateTransform(m,c.hitPoint)}else for(let m=0;m<lt.instanceCount-1;m++)lt.updateTransform(m,[0,-300,0]);mt.setProperty("uTime",W.frameStep);let h=.5,f=.5,d=x.create();x.scaleAndAdd(d,k.getInstance(0).position,et.forward,-h),x.scaleAndAdd(d,d,et.up,f),x.lerp(_.smoothCamPos,_.smoothCamPos,d,.1),x.lerp(_.smoothCamUp,_.smoothCamUp,et.up,.05),_.setPosition(_.smoothCamPos[0],_.smoothCamPos[1],_.smoothCamPos[2]),_.smoothLookAt(k.getInstance(0).position,_.smoothCamUp,t/1e3,9);let u=x.length(et.velocity);z.setTextAt(z.fromRight(11),z.cy,u.toString()),z.setTextAt(z.cx-5,z.fromBottom(6),"DAMAGE:"+Qi.toString().padStart(3,"0"));for(let m=0;m<At.instancePositions.length;m+=3){let g=oe[m/3];g.flip(),g.update(),At.instancePositions[m+1]=Math.floor(g.current)}if(Vt.setProperty("uScreenSize",[q.width,q.height]),ne.setProperty("uTime",W.loopTime),U.render(ot,_),Ce.render(_.viewMatrix,_.projectionMatrix,i,{pointSize:1,palette:G,color:[G[0],G[1],G[2],1]}),tr.drawImage(q,0,0,it.width,it.height),W.frameStep%2==0){Lo(e,z.cx-10,z.cy+7,0,6);for(let m=0;m<oe.length;m++){let g=oe[m];g.setTarget(z.instances[m].char),g.setDelay(0);let p=q.width/2-g.position[0],v=q.height/2-g.position[1]}}pt[W.frameStep%300]=zi(it),W.frameStep++}requestAnimationFrame(or)}function qo(e){let t=ct.getDerivative(e),i=ct.getSecondDerivative(e),r=ct.get(e),n=x.create(),s=x.create(),o=x.create();x.add(o,t,i),x.normalize(o,o);let a=x.create();x.cross(a,o,t),x.normalize(a,a);let l=x.create();return x.cross(l,a,t),x.normalize(l,l),{o:r,dt:t,r:a,n:l}}function Yo(){let e=qo(0);e.o=ct.get(0);let t=[e],i=50,r=x.create(),n=x.create(),s=x.create();for(let o=0;o<i;o++){let a=t[o],l=(o+1)/i,c={o:ct.get(l),dt:ct.getDerivative(l),r:x.create(),n:x.create()};x.subtract(r,c.o,a.o);let h=x.dot(r,r);if(h>0){let f=x.create(),d=x.dot(r,a.r);x.scale(s,r,2/h*d),x.subtract(f,a.r,s);let u=x.create(),m=x.dot(r,a.dt);x.scale(s,r,2/h*m),x.subtract(u,a.dt,s),x.subtract(n,c.dt,u);let g=x.dot(n,n);if(g>0){let p=x.dot(n,f);x.scale(s,n,2/g*p),x.subtract(c.r,f,s)}else x.copy(c.r,f)}else x.copy(c.r,a.r);x.cross(c.n,c.r,c.dt),t.push(c)}return t}function ar(e){let t=J.length-1,i=e*t,r=Math.floor(i);if(i===r||r>=t)return J[Math.min(r,t)];let n=r+1,s=r/t,o=n/t,a=(e-s)/(o-s),l={o:x.create(),dt:x.create(),r:x.create(),n:x.create()};return x.lerp(l.o,J[r].o,J[n].o,a),x.lerp(l.dt,J[r].dt,J[n].dt,a),x.lerp(l.r,J[r].r,J[n].r,a),x.lerp(l.n,J[r].n,J[n].n,a),l}function Xo(e){e.key==="g"&&(pt.length==300?Ho():alert("Not all frames recorded, yet. Please let the canvas run for a bit longer. For best results let the piece run for at least 10 seconds.")),e.key==="l"&&Wo()}function Wo(){let e,t;try{let i="image/png";e=it.toDataURL(i,1),Go(e.replace(i,"image/octet-stream"),"GAMERS.png")}catch(i){console.log(i);return}}function Go(e,t){let i=document.createElement("a");typeof i.download=="string"?(document.body.appendChild(i),i.download=t,i.href=e,i.click(),document.body.removeChild(i)):location.replace(uri)}function ko(e,t,i){let r=e instanceof Blob?e:new Blob([e],{type:i}),n=URL.createObjectURL(r),s=document.createElement("a");s.href=n,s.download=t,s.click()}async function Ho(){let e=Ri();for(let i=0;i<300;i++){let n=pt[i].getContext("2d").getImageData(0,0,pt[i].width,pt[i].height).data,s="rgb444",o=Ti(n,10,{format:s}),a=Ei(n,o,s);e.writeFrame(a,pt[i].width,pt[i].height,{palette:o,delay:30}),await new Promise(l=>setTimeout(l,0))}e.finish();let t=e.bytesView();ko(t,"mygif.gif",{type:"image/gif"})}})();
