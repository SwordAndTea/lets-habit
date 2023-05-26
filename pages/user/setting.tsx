import {CommonServerGetSideUserProp, PageUserProp, setUserStore} from "../../util/user";
import Image from "next/image";
import {DefaultUserPortraitIcon, SpinWaitIndicatorIcon} from "../../components/icons";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {AnonymousUsername} from "../../util/const";
import {Cropper, ReactCropperElement} from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Modal} from "../../components/modal";
import {useRouter} from "next/router";
import {noti} from "../../util/noti";
import {updateUserBaseInfo} from "../../api/user";


interface UserInfoItemWrapProps {
  name: string
  children: ReactNode
}

function UserInfoItemWrap(props: UserInfoItemWrapProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-gray-400">{props.name}</h2>
      {props.children}
    </div>
  )
}

export default function UserSettingPage(props: PageUserProp) {
  const route = useRouter()

  const [newPortrait/*the cropped image*/, setNewPortrait] = useState("")
  const [base64Img/*the origin image send to cropper*/, setBase64Img] = useState("")
  const [showCropper, setShowCropper] = useState(false)
  const cropperRef = useRef<ReactCropperElement>(null);

  const [newName, setNewName] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)


  useEffect(()=>{
    setUserStore(props.user)
  }, [])

  const handleUpdateUserBaseInfo = () => {
    if (!newPortrait && !newName) {
      noti.warning("no updated field")
      return
    }
    setIsUpdating(true)
    updateUserBaseInfo({
      name: newName,
      portrait: newPortrait ? newPortrait.replace(/^data:image\/\w+;base64,/, ""): ""
    }).then((resp) => {
      noti.success("update succeed")
      setUserStore(resp.data.data.user)
    }).finally(()=>{
      setTimeout(()=>{
        setIsUpdating(false)
      }, 500)
    })
  }

  return (
    <div className="w-full py-4 px-52">
      {showCropper && (
        <Modal
          onCancel={() => {
            setShowCropper(false)
          }}
          cancelBtnStyle="alter"
          onConfirm={() => {
            const cropper = cropperRef.current?.cropper;
            if (cropper) {
              setNewPortrait(cropper.getCroppedCanvas().toDataURL())
            }
            setShowCropper(false)
          }}
        >
          <Cropper
            ref={cropperRef}
            style={{height: 400, width: "100%"}}
            zoomTo={0.5}
            aspectRatio={1}
            src={base64Img}
            viewMode={1}
            minCropBoxHeight={200}
            minCropBoxWidth={200}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            guides={true}
          />
        </Modal>
      )}
      <div className="flex space-x-12">
        {/*portrait area*/}
        <label htmlFor="protaritChooser">
          <div className="w-40 h-40 rounded-full border-4 border-gray-400 overflow-hidden cursor-pointer relative">
            {newPortrait ? <Image alt={props.user.uid} src={newPortrait} className="object-contain" fill/> :
              (props.user.portrait ?
                  <Image alt={props.user.uid} src={props.user.portrait} className="object-contain" fill/> :
                  <DefaultUserPortraitIcon className="bg-gray-200"/>
              )
            }
          </div>
          <input
            id="protaritChooser"
            type="file"
            className="hidden"
            accept="image/png, image/jpeg"
            onClick={(event) => {
              // @ts-ignore
              event.target.value = null
            }}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                let file = e.target.files[0]
                const fileReader = new FileReader()
                fileReader.onloadend = () => {
                  if (fileReader.result) {
                    setBase64Img(fileReader.result as string)
                    setShowCropper(true)
                  }
                }
                fileReader.readAsDataURL(file)
              }
            }}
          />
        </label>

        {/*use info area*/}
        <div className="flex-1 space-y-6">
          <UserInfoItemWrap name="user id">
            <input
              type="text"
              className="w-full h-[44px] rounded-lg border-transparent ring-inset ring-2 ring-gray-200 focus:outline-none focus:border-transparent focus:ring-inset focus:ring-2 focus:ring-gray-400"
              defaultValue={props.user.uid}
              disabled
            />
          </UserInfoItemWrap>
          <UserInfoItemWrap name="username">
            <input
              type="text"
              className="w-full h-[44px] rounded-lg border-transparent ring-inset ring-2 ring-gray-200 focus:outline-none focus:border-transparent focus:ring-inset focus:ring-2 focus:ring-gray-400"
              defaultValue={props.user.name ? props.user.name : undefined}
              placeholder={AnonymousUsername}
              onChange={(e) => {
                if (e.target.value == props.user.name) {
                  setNewName("")
                } else {
                  setNewName(e.target.value)
                }
              }}
            />
          </UserInfoItemWrap>
          <UserInfoItemWrap name="email">
            <input
              type="text"
              className="w-full h-[44px] rounded-lg border-transparent ring-inset ring-2 ring-gray-200 focus:outline-none focus:border-transparent focus:ring-inset focus:ring-2 focus:ring-gray-400"
              defaultValue={props.user.email ? props.user.email : ""}
            />
            <></>
          </UserInfoItemWrap>

          <div className="bg-red-400/40 border border-red-400 rounded-lg px-2">
            <h1>
              Danger Area
            </h1>
            <button>delete account</button>
          </div>
        </div>
      </div>

      {/*cancel & commit btn*/}
      <div className="flex justify-end mt-6 space-x-4">
        <button
          className="alter-btn"
          onClick={() => route.back()}
        >
          Cancel
        </button>
        <button
          className={isUpdating ? "ml-4 bg-gray-500 text-white w-24 h-10 rounded-lg flex" : "primary-btn"}
          onClick={handleUpdateUserBaseInfo}
        >
          {isUpdating && <SpinWaitIndicatorIcon className="my-auto h-3/5 aspect-square ml-1"/>}
          <span className={isUpdating ? "my-auto ml-1" : "m-auto"}>Update</span>
        </button>
      </div>
    </div>
  )
}

export const getServerSideProps = CommonServerGetSideUserProp(false, true)
