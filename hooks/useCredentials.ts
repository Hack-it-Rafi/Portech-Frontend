import { create } from 'zustand'

type Store = {
    prvKey: string
    address: string
    setPrvKey: (newValue: string) => void
    setAddress: (newValue: string) => void
    loggedIn: boolean
    setLoggedIn: (newValue: boolean) => void
  }

const useStore = create<Store>()((set) => ({
    prvKey: "",
    address: "",
    loggedIn: false,
    setPrvKey: (newValue) => set(() => ({ prvKey: newValue })),
    setAddress: (newValue) => set(() => ({ address: newValue })),
    setLoggedIn: (newValue) => set(() => ({ loggedIn: newValue })),
  }))

export default useStore