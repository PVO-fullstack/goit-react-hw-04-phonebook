import React, { useState, useEffect } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { nanoid } from 'nanoid';
import { ContactForm } from '../ContactForm/ContactForm';
import { Filter } from '../Filter/Filter';
import { ContactList } from '../ContactList/ContactList';
import { ContactItem } from '../ContactItem/ContactItem';
import { Header, Title } from './App.styled';

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  const changeFilter = e => setFilter(e.target.value);

  const handleSubmitForm = data => {
    for (let contact of contacts) {
      if (contact.name === data.name) {
        return Notify.warning(`${data.name} is already in contacts`);
      }
    }
    const contact = {
      id: nanoid(),
      name: data.name,
      number: data.number,
    };
    setContacts(prevState => [...prevState, contact]);
  };

  const handleDeleteContact = contactId => {
    setContacts(prevState =>
      prevState.filter(contact => contact.id !== contactId)
    );
  };

  useEffect(() => {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      setContacts(parsedContacts);
    }
  }, []);

  useEffect(() => {
    if (contacts.length === 0) {
      return;
    }
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const normalaizeFilter = filter.toLowerCase();

  const visibleContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(normalaizeFilter)
  );

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101',
      }}
    >
      <Header>Phonebook</Header>
      <ContactForm onSubmit={handleSubmitForm} />
      <Title>Contacts</Title>
      <Filter value={filter} onChange={changeFilter} />
      <ContactList>
        <ContactItem
          visibleContacts={visibleContacts}
          onDeleteContact={handleDeleteContact}
        />
      </ContactList>
    </div>
  );
};
