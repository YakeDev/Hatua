import {
  createCvDocument,
  duplicateCvDocument,
  parseCvCollection,
  serializeCvCollection,
  type CvDocument,
} from '@hatua/domain'
import Storage from 'expo-sqlite/kv-store'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const STORAGE_KEY = 'hatua-cvs-v1'

interface CvStoreValue {
  documents: CvDocument[]
  storageError: string | null
  addDocument: () => string
  duplicateDocument: (id: string) => void
  updateDocument: (id: string, update: (cv: CvDocument) => CvDocument) => void
  deleteDocument: (id: string) => void
}

const CvStoreContext = createContext<CvStoreValue | null>(null)

function readInitialState(): { documents: CvDocument[]; storageError: string | null } {
  try {
    return { documents: parseCvCollection(Storage.getItemSync(STORAGE_KEY)), storageError: null }
  } catch (error) {
    console.warn('Impossible de lire les CV locaux :', error)
    // An unknown schema or damaged document must never be replaced by an empty list.
    return { documents: [], storageError: 'Les CV enregistrés ne peuvent pas être lus. Ils n’ont pas été effacés ; les modifications ne seront pas sauvegardées.' }
  }
}

export function CvStoreProvider({ children }: { children: ReactNode }) {
  const [initialState] = useState(readInitialState)
  const [documents, setDocuments] = useState(initialState.documents)
  const [storageError, setStorageError] = useState(initialState.storageError)

  useEffect(() => {
    if (initialState.storageError) return
    try {
      Storage.setItemSync(STORAGE_KEY, serializeCvCollection(documents))
      setStorageError(null)
    } catch (error) {
      console.warn('Impossible de sauvegarder les CV locaux :', error)
      setStorageError('La sauvegarde a échoué. Copiez vos informations avant de fermer l’application.')
    }
  }, [documents, initialState.storageError])

  const addDocument = () => {
    const cv = createCvDocument()
    setDocuments((current) => [cv, ...current])
    return cv.id
  }

  const duplicateDocument = (id: string) => {
    setDocuments((current) => {
      const original = current.find((cv) => cv.id === id)
      return original ? [duplicateCvDocument(original), ...current] : current
    })
  }

  const updateDocument = (id: string, update: (cv: CvDocument) => CvDocument) => {
    const updatedAt = new Date().toISOString()
    setDocuments((current) => current.map((cv) =>
      cv.id === id ? { ...update(cv), updatedAt } : cv
    ))
  }

  const deleteDocument = (id: string) => {
    setDocuments((current) => current.filter((cv) => cv.id !== id))
  }

  return <CvStoreContext.Provider value={{ documents, storageError, addDocument, duplicateDocument, updateDocument, deleteDocument }}>{children}</CvStoreContext.Provider>
}

export function useCvStore(): CvStoreValue {
  const value = useContext(CvStoreContext)
  if (!value) throw new Error('CvStoreProvider manquant')
  return value
}
