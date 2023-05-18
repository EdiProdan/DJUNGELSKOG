package hr.fer.world.traveller.backend.model.location;

public enum LocationType {

    MUSEUM("MUZEJ"),
    STADIUM("STADION"),
    CHURCH("CRKVA"),
    OTHER("OSTALO");

    private final String translation;
    LocationType(String translation){
        this.translation = translation;
    }

    public String getTranslation(){
        return translation;
    }
}
