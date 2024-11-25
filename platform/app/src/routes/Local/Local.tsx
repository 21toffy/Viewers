import React, { useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { DicomMetadataStore, MODULE_TYPES } from '@ohif/core';

import Dropzone from 'react-dropzone';
import filesToStudies from './filesToStudies';

import { extensionManager } from '../../App.tsx';

import { Icon, Button, LoadingIndicatorProgress } from '@ohif/ui';

const getLoadButton = (onDrop, text, isDir) => {
  return (
    <Dropzone
      onDrop={onDrop}
      noDrag
    >
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps()}>
          <Button
            rounded="full"
            variant="contained" // outlined
            disabled={false}
            endIcon={<Icon name="launch-arrow" />} // launch-arrow | launch-info
            className={classnames('font-medium', 'ml-2')}
            onClick={() => {}}
          >
            {text}
            {isDir ? (
              <input
                {...getInputProps()}
                webkitdirectory="true"
                mozdirectory="true"
              />
            ) : (
              <input {...getInputProps()} />
            )}
          </Button>
        </div>
      )}
    </Dropzone>
  );
};

interface FetchError {
  message: string;
  code?: string;
}

interface FileState {
  blob: Blob | null;
  name: string;
  type: string;
  size: number;
}

type LocalProps = {
  modePath: string;
};

function Local({ modePath }: LocalProps) {



  const navigate = useNavigate();


  const dropzoneRef = useRef();
  const [dropInitiated, setDropInitiated] = React.useState(false);

  const [file, setFile] = useState<FileState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<FetchError | null>(null);
  const [fileUrl, setfileUrl] = useState<string | null>(null);


  // Initializing the dicom local dataSource
  const dataSourceModules = extensionManager.modules[MODULE_TYPES.DATA_SOURCE];
  const localDataSources = dataSourceModules.reduce((acc, curr) => {
    const mods = [];
    curr.module.forEach(mod => {
      if (mod.type === 'localApi') {
        mods.push(mod);
      }
    });
    return acc.concat(mods);
  }, []);

  const firstLocalDataSource = localDataSources[0];
  const dataSource = firstLocalDataSource.createDataSource({});

  const microscopyExtensionLoaded = extensionManager.registeredExtensionIds.includes(
    '@ohif/extension-dicom-microscopy'
  );



  const onDrop = async acceptedFiles => {

    console.log(acceptedFiles, typeof acceptedFiles, "KKKKKKKKKKK")
    const studies = await filesToStudies([acceptedFiles], dataSource);

    const query = new URLSearchParams();

    if (microscopyExtensionLoaded) {
      // TODO: for microscopy, we are forcing microscopy mode, which is not ideal.
      //     we should make the local drag and drop navigate to the worklist and
      //     there user can select microscopy mode
      const smStudies = studies.filter(id => {
        const study = DicomMetadataStore.getStudy(id);
        return (
          study.series.findIndex(s => s.Modality === 'SM' || s.instances[0].Modality === 'SM') >= 0
        );
      });

      if (smStudies.length > 0) {
        smStudies.forEach(id => query.append('StudyInstanceUIDs', id));

        modePath = 'microscopy';
      }
    }

    // Todo: navigate to work list and let user select a mode
    studies.forEach(id => query.append('StudyInstanceUIDs', id));
    query.append('datasources', 'dicomlocal');

    navigate(`/${modePath}?${decodeURIComponent(query.toString())}`);
  };

  function blobToFile(blob: any, fileName: string) {
    return new File([blob], fileName, { type: blob.type || "application/dicom" });
  }

  const handleFetch = async (url: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const fileName = url.split('/').pop() || 'downloaded-file'; // or file name

      // const file = new File([blob], fileName, {
      //             type: blob.type,
      //             lastModified: new Date().getTime()
      //         });



      // const fileState: FileState = {
      //   blob,
      //   name: fileName,
      //   type: blob.type || 'application/octet-stream',
      //   size: blob.size
      // };
      const fileS = blobToFile(blob, fileName)

      setFile(fileS);
      console.log(fileS,"KKKKK")
      onDrop(fileS);
      // onSuccess?.(fileState);

    } catch (err) {
      const fetchError: FetchError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        code: 'FETCH_ERROR'
      };
      setError(fetchError);
      // onError?.(fetchError);
    } finally {
      setLoading(false);
    }
  };


  // Set body style
  useEffect(() => {
    document.body.classList.add('bg-black');
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);


  useEffect(() => {
    document.body.classList.add('bg-black');
    return () => {
      document.body.classList.remove('bg-black');
    };
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const searchParams = url.searchParams;

    const q = searchParams.get('file_url');
    setfileUrl(q)
    handleFetch(q)
    console.log(q, "file_urlsort");
  }, [])

  return (
    <div>
      {fileUrl ? <LoadingIndicatorProgress className={'h-full w-full bg-white'} /> : <a href= 'https://intron.io'>Goback </a>}

      <h1 style={{color: 'white'}}><LoadingIndicatorProgress className={'h-full w-full bg-white'} /></h1>
      <div style={{display:"none"}}>
        <Dropzone
          ref={dropzoneRef}
          onDrop={acceptedFiles => {
            setDropInitiated(true);
            handleFetch(fileUrl); // the image url
            // onDrop(acceptedFiles);
          }}
          noClick
        >
          {({ getRootProps }) => (
            <div
              {...getRootProps()}
              style={{ width: '100%', height: '100%' }}
            >
              <div className="flex h-screen w-screen items-center justify-center ">
                <div className="bg-secondary-dark mx-auto space-y-2 rounded-lg py-8 px-8 drop-shadow-md">
                  <div className="flex items-center justify-center">
                    <Icon
                      name="logo-dark-background"
                      className="h-28"
                    />
                  </div>
                  <div className="space-y-2 pt-4 text-center">
                    {dropInitiated ? (
                      <div className="flex flex-col items-center justify-center pt-48">
                        <LoadingIndicatorProgress className={'h-full w-full bg-black'} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-base text-blue-300">
                          Note: You data is not uploaded to any server, it will stay in your local
                          browser application
                        </p>
                        <p className="text-xg text-primary-active pt-6 font-semibold">
                          Drag and Drop DICOM files here to load them in the Viewer
                        </p>
                        <p className="text-lg text-blue-300">Or click to </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-around pt-4 ">
                    {getLoadButton(onDrop, 'Load files', false)}
                    {getLoadButton(onDrop, 'Load folders', true)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dropzone>

      </div>

    </div>

  );
}

export default Local;
