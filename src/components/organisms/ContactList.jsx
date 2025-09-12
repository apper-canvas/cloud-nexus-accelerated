import React, { useState } from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ContactList = ({ contacts, onDeleteContact }) => {
  const [searchTerm, setSearchTerm] = useState("");
const [sortField, setSortField] = useState("firstName");
  const [sortDirection, setSortDirection] = useState("asc");

const filteredContacts = contacts.filter(contact => {
    const firstName = contact.first_name_c || '';
    const lastName = contact.last_name_c || '';
    
    return firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (contact.email_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (contact.company_c || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (contact.position_c || '').toLowerCase().includes(searchTerm.toLowerCase());
  });
const sortedContacts = [...filteredContacts].sort((a, b) => {
    let aValue = "";
    let bValue = "";
    
    if (sortField === "firstName") {
      aValue = a.first_name_c || '';
      bValue = b.first_name_c || '';
    } else if (sortField === "lastName") {
      aValue = a.last_name_c || '';
      bValue = b.last_name_c || '';
    } else {
      aValue = (a[sortField] || "").toString();
      bValue = (b[sortField] || "").toString();
    }
    
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "ArrowUpDown";
    return sortDirection === "asc" ? "ArrowUp" : "ArrowDown";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          placeholder="Search contacts..."
          onSearch={setSearchTerm}
          className="w-full sm:max-w-md"
        />
        <Link to="/contacts/new">
          <Button className="w-full sm:w-auto">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
<th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("firstName")}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    First Name
                    <ApperIcon name={getSortIcon("firstName")} className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("lastName")}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Last Name
                    <ApperIcon name={getSortIcon("lastName")} className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Email
                    <ApperIcon name={getSortIcon("email")} className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("company")}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Company
                    <ApperIcon name={getSortIcon("company")} className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left">
                  <button
                    onClick={() => handleSort("position")}
                    className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
                  >
                    Position
                    <ApperIcon name={getSortIcon("position")} className="ml-1 h-3 w-3" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
</thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedContacts.map((contact) => (
                <tr key={contact.Id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center">
<span className="text-sm font-medium">
{(() => {
                            const firstName = contact.first_name_c || '';
                            return firstName.charAt(0)?.toUpperCase() || '?';
                          })()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {(() => {
                            const firstName = contact.first_name_c || '';
                            const lastName = contact.last_name_c || '';
                            return `${firstName} ${lastName}`.trim() || 'No name';
                          })()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {contact.last_name_c || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.company}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="default">{contact.position}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{contact.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/contacts/${contact.Id}`}>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Eye" className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/contacts/${contact.Id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <ApperIcon name="Edit" className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDeleteContact(contact.Id)}
                        className="text-error hover:text-red-700"
                      >
                        <ApperIcon name="Trash2" className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {sortedContacts.length === 0 && (
        <div className="text-center py-8">
          <ApperIcon name="Users" className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900 mb-2">No contacts found</p>
          <p className="text-gray-500 mb-4">
{searchTerm ? "Try adjusting your search terms to find contacts by first name, last name, email, company, or position" : "Get started by adding your first contact with separate first and last name fields"}
          </p>
          <Link to="/contacts/new">
            <Button>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add First Contact
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ContactList;