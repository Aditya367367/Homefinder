import ListProperty from "../components/list_property/index";
import Layout from "../components/layouts/allpagelayout";
const ListPropertyPage = () => {
  return (
    <Layout>
      <div className="bg-[#0f1115] text-white min-h-screen p-4">
        <ListProperty />
      </div>
    </Layout>
  );
}   
export default ListPropertyPage;