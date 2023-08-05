
import { useState, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid';
import './App.css'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { storage } from './firebase';
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject, updateMetadata, getMetadata } from 'firebase/storage';
import Image from './components/Image';


const auth = getAuth();
const provider = new GoogleAuthProvider();

function App(props) {
  const [logged, setLogged] = useState(null);
  const [userName, setUserName] = useState('');
  const [image, setImage] = useState(null);
  const [imageList, setImageList] = useState([]); 
  const [counter, setCounter] = useState(0);
  const [diagonal, setDiagonal] = useState(false);

  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLogged(true);
        setUserName(user.displayName);
      } else {
        setLogged(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function uploadImage() {
    if (image == null) return;

    const imageRef = ref(storage, `images/${image.name + nanoid()}`)
    uploadBytes(imageRef, image).then(() => {
      alert('image uploaded');
      setCounter((prev) => prev + 1);
    })
    .catch((error) => {
      alert(error);
    })
  }

  function deleteImage(imageUrl) {
    const imageRef = ref(storage, imageUrl);
    deleteObject(imageRef)
      .then(() => {
        alert('Image deleted');
        setImageList(prevImageList => prevImageList.filter(url => url !== imageUrl));
      })
      .catch((error) => {
        alert(error);
      });
  }

  const imageListRef = ref(storage, 'images/');
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        const promises = response.items.map((item) => {
          const metadataPromise = getMetadata(item);
          const downloadUrlPromise = getDownloadURL(item);
          return Promise.all([metadataPromise, downloadUrlPromise, item.fullPath]);
        });
        return Promise.all(promises);
      })
      .then((results) => {
        console.log(results)
        const imageList = results.map(([metadata, url, fullPath]) => ({
          url,
          fullPath,
          width: metadata?.width || 1000,
          height: metadata?.height || 500,
        }));
        setImageList(imageList);
      })
      .catch((error) => {
        console.log("Error fetching image URLs:", error);
      });
  }, [counter]);
  
  function handleResizeComplete(width, height, imagePath) {
    const metadata = {
      customMetadata: {
        'width': width,
        'height': height
      }
    };
  const resizedImageRef = ref(storage, `${imagePath}.jpeg`)
   updateMetadata(resizedImageRef, metadata)
   .then(() => {
     console.log('success');
   }).catch((error) => {
     console.log(error)
   })
  }

  const imageDisplay = imageList.map(image => (
    <div key={nanoid()}>
      <Image 
        url={image.url}
        width={image.width}
        height={image.height}
        diagonal={diagonal}
        onResizeComplete={(width, height) => handleResizeComplete(width, height, image.fullPath)}
      />
      {logged && <button className='deleteButton' onClick={() => deleteImage(image.fullPath)}>Delete</button>}
    </div>
  ));

  return (

    <>
    <div className="header">
    {!logged && <div className='signIn'>
      <button id='signIn' onClick={() => {
        signInWithPopup(auth, provider)
      }}>Sign In</button>
    </div>}

    {logged && <div className='signOut'>
      <div className="userInfo">
        <h3>{`Hello ${userName}`}</h3>
      </div>
      <button id='signOut' onClick={() => {
        auth.signOut();
      }}>Sign Out</button>
    </div>}

    {logged && <div>
    <input type="file" onChange={(e) => {
      setImage(e.target.files[0]);
      console.log(e.target.files[0]);
    }}/>
    <button onClick={uploadImage}>Upload Image</button>
    </div>}
    </div>
    
    <div className='allImages'>
    {imageDisplay}
    </div>

    <button className='diagonalButton' onClick={(e) => 
     { e.preventDefault()
      setDiagonal((prev) => !prev)
      }
      }>Diagonal resize</button>
    </>

    
  )
}

export default App
