"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[7197,2591],{96975:(e,t,n)=>{n.r(t),n.d(t,{default:()=>R});const a=JSON.parse('{"UU":"@ohif/extension-cornerstone-dicom-seg"}').UU,o=`${a}.sopClassHandlerModule.dicom-seg`;var s=n(86326),r=n(29463),i=n(81985),c=n(55139),d=n(33970),l=n(5842);const g=["1.2.840.10008.5.1.4.1.1.66.4"],m={};function S(e,t,n){const a=e[0],{StudyInstanceUID:s,SeriesInstanceUID:S,SOPInstanceUID:p,SeriesDescription:u,SeriesNumber:I,SeriesDate:h,SOPClassUID:v,wadoRoot:y,wadoUri:D,wadoUriRoot:f}=a,b={Modality:"SEG",loading:!1,isReconstructable:!0,displaySetInstanceUID:r.Wp.guid(),SeriesDescription:u,SeriesNumber:I,SeriesDate:h,SOPInstanceUID:p,SeriesInstanceUID:S,StudyInstanceUID:s,SOPClassHandlerId:o,SOPClassUID:v,referencedImages:null,referencedSeriesInstanceUID:null,referencedDisplaySetInstanceUID:null,isDerivedDisplaySet:!0,isLoaded:!1,isHydrated:!1,segments:{},sopClassUids:g,instance:a,instances:[a],wadoRoot:y,wadoUriRoot:f,wadoUri:D,isOverlayDisplaySet:!0},w=a.ReferencedSeriesSequence;if(!w)return void console.error("ReferencedSeriesSequence is missing for the SEG");const T=w[0]||w;b.referencedImages=a.ReferencedSeriesSequence.ReferencedInstanceSequence,b.referencedSeriesInstanceUID=T.SeriesInstanceUID;const{displaySetService:E}=t.services,U=E.getDisplaySetsForSeries(b.referencedSeriesInstanceUID)[0];if(U)b.referencedDisplaySetInstanceUID=U.displaySetInstanceUID;else{const{unsubscribe:e}=E.subscribe(E.EVENTS.DISPLAY_SETS_ADDED,(({displaySetsAdded:t})=>{const n=t[0];n.SeriesInstanceUID===b.referencedSeriesInstanceUID&&(b.referencedDisplaySetInstanceUID=n.displaySetInstanceUID,e())}))}return b.load=async({headers:e})=>await function(e,t,n,a){const{SOPInstanceUID:o}=e,{segmentationService:s}=t.services;if((e.loading||e.isLoaded)&&m[o]&&function(e){return c.segmentation.state.getSegmentation(e.displaySetInstanceUID)}(e))return m[o];return e.loading=!0,m[o]=new Promise((async(o,r)=>{if(!e.segments||0===Object.keys(e.segments).length)try{await async function({extensionManager:e,servicesManager:t,segDisplaySet:n,headers:a}){const o=e.getModuleEntry("@ohif/extension-cornerstone.utilityModule.common"),{segmentationService:s,uiNotificationService:r}=t.services,{dicomLoaderService:g}=o.exports,m=await g.findDicomDataPromise(n,null,a),S=t.services.displaySetService.getDisplaySetByUID(n.referencedDisplaySetInstanceUID);if(!S)throw new Error("referencedDisplaySet is missing for SEG");const{instances:p}=S,u=p.map((({imageId:e})=>e)),I=.001,h=!0;i.eventTarget.addEventListener(d.fX.s.SEGMENTATION_LOAD_PROGRESS,(e=>{const{percentComplete:t}=e.detail;s._broadcastEvent(s.EVENTS.SEGMENT_LOADING_COMPLETE,{percentComplete:t})}));const v=await d.ql.Cornerstone3D.Segmentation.generateToolState(u,m,i.metaData,{skipOverlapping:h,tolerance:I,eventTarget:i.eventTarget,triggerEvent:i.triggerEvent});let y=!0;v.segMetadata.data.forEach(((e,t)=>{var n;t>0&&(e.rgba=e.RecommendedDisplayCIELabValue,e.rgba?e.rgba=(n=e.rgba,l.Ay.data.Colors.dicomlab2RGB(n).map((e=>Math.round(255*e)))):(y=!1,e.rgba=c.CONSTANTS.COLOR_LUT[t%c.CONSTANTS.COLOR_LUT.length]))})),v.overlappingSegments&&r.show({title:"Overlapping Segments",message:"Unsupported overlapping segments detected, segmentation rendering results may be incorrect.",type:"warning"});y||r.show({title:"DICOM SEG import",message:"RecommendedDisplayCIELabValue not found for one or more segments. The default color was used instead.",type:"warning",duration:5e3});Object.assign(n,v)}({extensionManager:n,servicesManager:t,segDisplaySet:e,headers:a})}catch(t){return e.loading=!1,r(t)}s.createSegmentationForSEGDisplaySet(e).then((()=>{e.loading=!1,o()})).catch((t=>{e.loading=!1,r(t)}))})),m[o]}(b,t,n,e),[b]}const p=function({servicesManager:e,extensionManager:t}){return[{name:"dicom-seg",sopClassUids:g,getDisplaySetsFromSeries:n=>S(n,e,t)}]},u={id:"@ohif/seg",name:"Segmentations",protocolMatchingRules:[],toolGroupIds:["default"],numberOfPriorsReferenced:0,defaultViewport:{viewportOptions:{viewportType:"stack",toolGroupId:"default",allowUnmatchedView:!0,syncGroups:[{type:"hydrateseg",id:"sameFORId",source:!0,target:!0}]},displaySets:[{id:"segDisplaySetId",matchedDisplaySetsIndex:-1}]},displaySetSelectors:{segDisplaySetId:{seriesMatchingRules:[{attribute:"Modality",constraint:{equals:"SEG"}}]}},stages:[{name:"Segmentations",viewportStructure:{layoutType:"grid",properties:{rows:1,columns:1}},viewports:[{viewportOptions:{allowUnmatchedView:!0,syncGroups:[{type:"hydrateseg",id:"sameFORId",source:!0,target:!0}]},displaySets:[{id:"segDisplaySetId"}]}]}]};const I=function(){return[{name:u.id,protocol:u}]};var h=n(71520),v=n(38993),y=n(42008),D=n(58498);const{segmentation:f}=c.utilities,{datasetToBlob:b}=l.Ay.data,{Cornerstone3D:{Segmentation:{generateSegmentation:w}}}=d.ql,{Cornerstone3D:{RTSS:{generateRTSSFromSegmentations:T}}}=d.f_,{vk:E}=d._$,U=({servicesManager:e,extensionManager:t})=>{const{segmentationService:n,uiDialogService:a,displaySetService:o,viewportGridService:s,toolGroupService:d}=e.services,g={loadSegmentationsForViewport:async({segmentations:e,viewportId:t})=>{const a=(({viewportId:e,viewportGridService:t})=>{const{viewports:n,activeViewportId:a}=t.getState(),o=e||a;return n.get(o)})({viewportId:t,viewportGridService:s}),r=a.displaySetInstanceUIDs[0],i=e[0],c=i.segmentationId,d=i.config.label,l=i.config.segments,g=o.getDisplaySetByUID(r);return await n.createLabelmapForDisplaySet(g,{segmentationId:c,segments:l,label:d}),n.addOrUpdateSegmentation(i),await n.addSegmentationRepresentation(a.viewportId,{segmentationId:c}),c},generateSegmentation:({segmentationId:e,options:t={}})=>{const a=c.segmentation.state.getSegmentation(e),{imageIds:o}=a.representationData.Labelmap,s=o.map((e=>i.cache.getImage(e))),r=s.map((e=>i.cache.getImage(e.referencedImageId))),d=[];let g=0;for(const e of s){const t=new Set,n=e.getPixelData(),{rows:a,columns:o}=e;for(let e=0;e<n.length;e++){const a=n[e];0!==a&&t.add(a)}d[g++]={segmentsOnLabelmap:Array.from(t),pixelData:n,rows:a,columns:o}}const m=d.map((e=>e.segmentsOnLabelmap)),S={segmentsOnLabelmap:Array.from(new Set(m.flat())),metadata:[],labelmaps2D:d},p=n.getSegmentation(e),u=n.getRepresentationsForSegmentation(e);Object.entries(p.segments).forEach((([t,a])=>{if(!a)return;const{label:o}=a,s=u[0],r=n.getSegmentColor(s.viewportId,e,a.segmentIndex),i=l.Ay.data.Colors.rgb2DICOMLAB(r.slice(0,3).map((e=>e/255))).map((e=>Math.round(e))),c={SegmentNumber:t.toString(),SegmentLabel:o,SegmentAlgorithmType:a?.algorithmType||"MANUAL",SegmentAlgorithmName:a?.algorithmName||"OHIF Brush",RecommendedDisplayCIELabValue:i,SegmentedPropertyCategoryCodeSequence:{CodeValue:"T-D0050",CodingSchemeDesignator:"SRT",CodeMeaning:"Tissue"},SegmentedPropertyTypeCodeSequence:{CodeValue:"T-D0050",CodingSchemeDesignator:"SRT",CodeMeaning:"Tissue"}};S.metadata[t]=c}));return w(r,S,i.metaData,t)},downloadSegmentation:({segmentationId:e})=>{const t=n.getSegmentation(e),a=g.generateSegmentation({segmentationId:e});E(a.dataset,`${t.label}`)},storeSegmentation:async({segmentationId:e,dataSource:o})=>{const s=await(0,h.createReportDialogPrompt)(a,{extensionManager:t});if(1!==s.action&&!s.value)return;const i=n.getSegmentation(e);if(!i)throw new Error("No segmentation found");const{label:c}=i,d=s.value||c||"Research Derived Series",l=g.generateSegmentation({segmentationId:e,options:{SeriesDescription:d}});if(!l||!l.dataset)throw new Error("Error during segmentation generation");const{dataset:m}=l;return await o.store.dicom(m),m.wadoRoot=o.getConfig().wadoRoot,r.H8.addInstances([m],!0),m},downloadRTSS:({segmentationId:e})=>{const t=n.getSegmentation(e),a={vtkImageMarchingSquares:v.Ay,vtkDataArray:y.Ay,vtkImageData:D.Ay},o=T(t,r.Ly.MetadataProvider,r.H8,i.cache,c.Enums,a);try{const e=b(o),t=URL.createObjectURL(e);window.location.assign(t)}catch(e){console.warn(e)}},setBrushSize:({value:e,toolNames:t})=>{const n=Number(e);d.getToolGroupIds()?.forEach((e=>{0===t?.length?f.setBrushSizeForToolGroup(e,n):t?.forEach((t=>{f.setBrushSizeForToolGroup(e,n,t)}))}))},setThresholdRange:({value:e,toolNames:t=["ThresholdCircularBrush","ThresholdSphereBrush"]})=>{d.getToolGroupIds()?.forEach((n=>{const a=d.getToolGroup(n);t?.forEach((t=>{a.setToolConfiguration(t,{strategySpecificConfiguration:{THRESHOLD:{threshold:e}}})}))}))}},m={loadSegmentationDisplaySetsForViewport:{commandFn:g.loadSegmentationDisplaySetsForViewport},loadSegmentationsForViewport:{commandFn:g.loadSegmentationsForViewport},generateSegmentation:{commandFn:g.generateSegmentation},downloadSegmentation:{commandFn:g.downloadSegmentation},storeSegmentation:{commandFn:g.storeSegmentation},downloadRTSS:{commandFn:g.downloadRTSS},setBrushSize:{commandFn:g.setBrushSize},setThresholdRange:{commandFn:g.setThresholdRange}};return{actions:g,definitions:m,defaultContext:"SEGMENTATION"}};function M(){return M=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)({}).hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},M.apply(null,arguments)}const C=s.lazy((()=>n.e(8295).then(n.bind(n,58295)))),O=e=>s.createElement(s.Suspense,{fallback:s.createElement("div",null,"Loading...")},s.createElement(C,e)),R={id:a,getCommandsModule:U,getToolbarModule:function({servicesManager:e}){const{segmentationService:t,toolbarService:n,toolGroupService:a}=e.services;return[{name:"evaluate.cornerstone.segmentation",evaluate:({viewportId:e,button:o,toolNames:s,disabledText:r})=>{const i=t.getSegmentationRepresentations(e);if(!i?.length)return{disabled:!0,className:"!text-common-bright !bg-black opacity-50",disabledText:r??"No segmentations available"};const c=a.getToolGroupForViewport(e);if(!c)return{disabled:!0,className:"!text-common-bright ohif-disabled",disabledText:r??"Not available on the current viewport"};const d=n.getToolNameForButton(o);if(!c.hasTool(d)&&!s)return{disabled:!0,className:"!text-common-bright ohif-disabled",disabledText:r??"Not available on the current viewport"};const l=s?s.includes(c.getActivePrimaryMouseButtonTool()):c.getActivePrimaryMouseButtonTool()===d;return{disabled:!1,className:l?"!text-black !bg-primary-light hover:bg-primary-light hover-text-black hover:cursor-pointer":"!text-common-bright !bg-black hover:bg-primary-light hover:cursor-pointer hover:text-black",isActive:l}}}]},getViewportModule:({servicesManager:e,extensionManager:t,commandsManager:n})=>[{name:"dicom-seg",component:a=>s.createElement(O,M({servicesManager:e,extensionManager:t,commandsManager:n},a))}],getSopClassHandlerModule:p,getHangingProtocolModule:I}}}]);
//# sourceMappingURL=7197.bundle.c8f9e6675e7a0b3a5afe.js.map