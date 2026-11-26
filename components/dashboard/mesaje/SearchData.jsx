const SearchData = ({ mesaje }) => {
  return (
    <table className="table">
      <thead className="thead-light">
        <tr>
          <th scope="col">Id</th>
          {/* <th className="dn-lg" scope="col">
            Stare
          </th> */}
          <th className="dn-lg" scope="col">
            Nume
          </th>
          <th scope="col">E-mail</th>
          <th scope="col">Trimis</th>
          {/* <th scope="col">Văzut</th> */}
          <th scope="col">Acțiuni</th>
        </tr>
      </thead>
      {/* End thead */}

      <tbody>
        {mesaje.map((mesaj, index) => (
          <tr key={mesaj.documentId}>
            <th className="title" scope="row">
              #{index + 1}
            </th>
            {/* <td className="dn-lg">
              <span className="flaticon-view"></span>
            </td> */}
            <td className="dn-lg">{mesaj.name}</td>
            <td>{mesaj.email}</td>
            <td className="para">
              {mesaj.firstUploadDate} {mesaj.firstUploadTime}
            </td>
            {/* <td className="para">
              {mesaj.firstUploadDate} {mesaj.firstUploadTime}
            </td> */}
            <td>
              <ul className="view_edit_delete_list mb0">
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="View"
                >
                  <span>
                    <span className="flaticon-view"></span>
                  </span>
                </li>
                {/* <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Edit"
                >
                  <span>
                    <span className="flaticon-edit"></span>
                  </span>
                </li> */}
                <li
                  className="list-inline-item"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Delete"
                >
                  <span>
                    <span className="flaticon-garbage"></span>
                  </span>
                </li>
              </ul>
            </td>
          </tr>
        ))}
        {/* End tr */}
      </tbody>
      {/* End tbody */}
    </table>
  );
};

export default SearchData;
