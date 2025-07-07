const Service = ({ src, title }) => {
  return (
    <div className="service-card">
      <img src={src} alt={title}  className="img-fluid service-image" />
    </div>
  );
};

export default Service;