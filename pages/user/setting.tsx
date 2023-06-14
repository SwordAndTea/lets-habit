import {CommonServerGetSideUserProp, PageUserProp, setUserStore} from "../../util/user";
import Image from "next/image";
import {DefaultUserPortraitIcon, SpinWaitIndicatorIcon} from "../../components/icons";
import React, {ReactNode, useEffect, useRef, useState} from "react";
import {AnonymousUsername, RoutePath} from "../../util/const";
import {Cropper, ReactCropperElement} from "react-cropper";
import "cropperjs/dist/cropper.css";
import {Modal} from "../../components/modal";
import {useRouter} from "next/router";
import {noti} from "../../util/noti";
import {deleteUser, updateUserBaseInfo} from "../../api/user";


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

interface InfoBlockProps {
  name: string
  children: ReactNode
  titleStyle: "normal" | "alter"
}

function InfoBlock(props: InfoBlockProps) {
  return (
    <div>
      <h1 className={`font-bold text-4xl ${props.titleStyle == "alter" ? "text-rose-500" : ""}`}>
        {props.name}
      </h1>
      <div className="space-y-5 mt-4">
        {props.children}
      </div>
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
  const [isUpdatingBaseInfo, setIsUpdatingBaseInfo] = useState(false)

  const [showDeleteAlter, setShowDeleteAlter] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)
  const [currentUser, setCurrentUser] = useState(props.user)


  useEffect(() => {
    setUserStore(props.user)
  }, [])

  const handleUpdateUserBaseInfo = () => {
    if (!newPortrait && !newName) {
      noti.warning("no fields to update")
      return
    }
    setIsUpdatingBaseInfo(true)
    updateUserBaseInfo({
      name: newName,
      portrait: newPortrait ? newPortrait.replace(/^data:image\/\w+;base64,/, "") : ""
    }).then((resp) => {
      noti.success("update succeed")
      setUserStore(resp.data.data.user)
      setCurrentUser(resp.data.data.user)
      setNewPortrait("")
      setNewName("")
    }).finally(() => {
      setTimeout(() => {
        setIsUpdatingBaseInfo(false)
      }, 500)
    })
  }

  const handleDeleteAccount = () => {
    setIsDeletingAccount(true)
    deleteUser().then(()=>{
      route.replace(RoutePath.LoginPage)
    })
  }

  return (
    <div className="w-full pt-6 pb-12 px-72">
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
            checkOrientation={false}
            guides={true}
          />
        </Modal>
      )}

      {showDeleteAlter && (
        <Modal
          onCancel={() => {
            setShowDeleteAlter(false)
          }}
          onConfirm={() => {
            handleDeleteAccount()
          }}
          confirmBtnStyle={isDeletingAccount ? "waiting" : "alter"}
        >
          <p className="text-rose-500">
            Delete your account will immediately remove all of the user data permanently. Are you sure to delete?
          </p>
        </Modal>
      )}

      <div>
        {/*use info area*/}
        <div className="flex-1 space-y-8">
          {/*base information*/}
          <InfoBlock name="Base Info" titleStyle="normal">
            <div className="w-40 h-40">
              <label htmlFor="protaritChooser">
                <div
                  className="w-40 h-40 rounded-full border-4 border-gray-400 overflow-hidden cursor-pointer relative">
                  {newPortrait ? <Image alt={currentUser.uid} src={newPortrait} className="object-contain" fill/> :
                    (currentUser.portrait ?
                        <Image alt={currentUser.uid} src={currentUser.portrait} className="object-contain" fill/> :
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
            </div>

            <UserInfoItemWrap name="user id">
              <input
                type="text"
                className="common-input"
                defaultValue={currentUser.uid}
                readOnly
              />
            </UserInfoItemWrap>
            <UserInfoItemWrap name="username">
              <input
                type="text"
                className="common-input"
                defaultValue={currentUser.name ? currentUser.name : undefined}
                placeholder={AnonymousUsername}
                onChange={(e) => {
                  if (e.target.value == currentUser.name) {
                    setNewName("")
                  } else {
                    setNewName(e.target.value)
                  }
                }}
              />
            </UserInfoItemWrap>
            {/*commit btn*/}
            <button
              className={isUpdatingBaseInfo ? "wait-btn w-full h-10" : "primary-btn w-full h-10"}
              onClick={handleUpdateUserBaseInfo}
            >
              {isUpdatingBaseInfo && <SpinWaitIndicatorIcon className="wait-btn-indicator"/>}
              <span>update base info</span>
            </button>
          </InfoBlock>

          <InfoBlock name="Login info" titleStyle="normal">
            <UserInfoItemWrap name="email">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="common-input"
                  defaultValue={currentUser.email ? currentUser.email : ""}
                />
                <button className="px-3 bg-cyan-500 text-white rounded-lg">
                  bind
                </button>
              </div>

            </UserInfoItemWrap>
          </InfoBlock>

          <InfoBlock name="Dangerous area" titleStyle="alter">
            <button
              className="w-full text-rose-500 border border-rose-500 rounded py-1 hover:bg-rose-200"
              onClick={() => {
                setShowDeleteAlter(true)
              }}
            >
              Delete Account
            </button>
          </InfoBlock>
        </div>
      </div>
    </div>
  )
}

export const getServerSideProps = CommonServerGetSideUserProp(false, true)
