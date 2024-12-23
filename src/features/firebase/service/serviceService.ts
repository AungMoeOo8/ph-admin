import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ServiceProps } from "./serviceProps";

export async function getservices() {
    const services: ServiceProps[] = [];

    const querySnapshot = await getDocs(collection(db, "service"));
    querySnapshot.forEach((doc) => {
        const service = doc.data() as ServiceProps;
        service.id = doc.id
        services.push(service);
    });

    return services
}

export async function getServiceById(id: string) {
    const docSnapshot = await getDoc(doc(db, "service", id))
    return docSnapshot.data() as ServiceProps
}

export async function saveService(service: ServiceProps) {
    const docRef = await addDoc(collection(db, "service"), service)
    service.id = docRef.id
    return service;
}

export async function deleteService(id: string) {
    const serviceRef = doc(db, "service", id);
    await deleteDoc(serviceRef);
}