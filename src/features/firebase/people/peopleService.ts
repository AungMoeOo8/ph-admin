// import { addDoc, collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { PersonProps } from "./peopleProps";

// export async function getPeople() {
//     const people: PersonProps[] = [];

//     const querySnapshot = await getDocs(collection(db, "people"));
//     querySnapshot.forEach((doc) => {
//         const person = doc.data() as PersonProps;
//         person.id = doc.id
//         people.push(person);
//     });

//     return people
// }

// export async function getPersonById(id: string) {
//     const docSnapshot = await getDoc(doc(db, "people", id))
//     return docSnapshot.data() as PersonProps
// }

// export async function savePerson(person: PersonProps) {
//     const docRef = await addDoc(collection(db, "people"), person)
//     person.id = docRef.id
//     return person;
// }

// export async function deletePerson(id: string) {
//     const personRef = doc(db, "people", id);
//     await deleteDoc(personRef);
// }