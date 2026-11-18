package com.boutique.backend.config;

import com.boutique.backend.entity.Categorie;
import com.boutique.backend.entity.Produit;
import com.boutique.backend.entity.Role;
import com.boutique.backend.entity.Utilisateur;
import com.boutique.backend.repository.CategorieRepository;
import com.boutique.backend.repository.ProduitRepository;
import com.boutique.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DonneesInitiales implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DonneesInitiales.class);

    private static final String IMG = "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/"
            + "u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/";
    private static final String IMG_JORDAN = "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/"
            + "u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/";

    private static final String POINTURES_ADULTE = "39,40,41,42,43,44,45";
    private static final String POINTURES_FEMME = "36,37,38,39,40,41";
    private static final String POINTURES_ENFANT = "32,33,34,35,36,37,38";
    private static final String TAILLES_ADULTE = "XS,S,M,L,XL,XXL";
    private static final String TAILLES_ENFANT = "8A,10A,12A,14A,16A";

    private final CategorieRepository categorieRepository;
    private final ProduitRepository produitRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.mot-de-passe}")
    private String adminMotDePasse;

    @Override
    @Transactional
    public void run(String... args) {
        creerAdmin();
        Categorie homme = categorie("Homme");
        Categorie femme = categorie("Femme");
        Categorie enfant = categorie("Enfant");

        produit(homme, "Nike Air Force 1 '07",
                "La légende du basket revisitée : cuir lisse, semelle Air pour l'amorti et finitions brillantes. Un classique qui va avec tout.",
                119.99, 25, POINTURES_ADULTE, IMG + "e6da41fa-1be4-4ce5-b89c-22be4f1f02d4/AIR+FORCE+1+%2707.png");
        produit(homme, "Nike Dunk Low Retro",
                "Silhouette basket des années 80, empiècements en cuir superposés et semelle en caoutchouc pour une adhérence durable.",
                129.99, 18, POINTURES_ADULTE, IMG + "a68c5bdb-76e9-486b-bb41-44fee765603a/NIKE+DUNK+LOW+RETRO.png");
        produit(homme, "Air Jordan 1 Mid Utility",
                "La Jordan 1 Mid dans une version utilitaire : matières robustes, détails techniques et le logo Wings emblématique.",
                139.99, 12, POINTURES_ADULTE, IMG_JORDAN + "c5eedfff-4338-4f30-8b80-89a17941d1d3/AIR+JORDAN+1+MID+UTILITY.png");
        produit(homme, "Nike Pegasus Plus 2",
                "Chaussure de running sur route avec mousse ZoomX sur toute la longueur pour un retour d'énergie maximal à chaque foulée.",
                169.99, 15, POINTURES_ADULTE, IMG + "6a69bd46-726a-4ccf-9de3-89a0f33c0465/NIKE+PEGASUS+PLUS+2.png");
        produit(homme, "Sweat Nike Solo Fleece",
                "Sweat à col rond en molleton brossé, doux et chaud, avec une coupe décontractée pour tous les jours.",
                69.99, 30, TAILLES_ADULTE, IMG + "54585845-22ae-44d3-88ee-f8cbbed8b337/M+NK+SOLO+BB+LS+CREW.png");
        produit(homme, "Pantalon Nike Solo Fleece",
                "Pantalon en molleton avec cordon de serrage aux chevilles et poches latérales. Confort garanti du matin au soir.",
                74.99, 22, TAILLES_ADULTE, IMG + "975e6c7e-329f-4be6-a95c-709bad4f2357/M+NK+SOLO+BB+BUNGEE+PANT.png");
        produit(homme, "T-shirt Jordan Brooklyn",
                "T-shirt en coton épais avec graphisme sneaker sur le devant. Coupe ample inspirée du streetwear.",
                39.99, 40, TAILLES_ADULTE, IMG_JORDAN + "e2b61ffd-ea7d-4ce6-91ef-d6547dade6d6/M+J+BRK+SNKR+GFX+SS+CREW.png");
        produit(homme, "Pantalon cargo Jordan Brooklyn",
                "Cargo en toile tissée avec poches à rabat, taille élastiquée et coupe droite pour un look urbain.",
                84.99, 14, TAILLES_ADULTE, IMG_JORDAN + "c967ad67-4aa5-4af3-834a-f210efdda992/M+J+BRK+WOVEN+CARGO+PNT.png");
        produit(homme, "Haut Nike Primary Dri-FIT",
                "Haut à manches courtes en tissu Dri-FIT qui évacue la transpiration. Idéal pour l'entraînement comme pour le quotidien.",
                59.99, 0, TAILLES_ADULTE, IMG + "c84387da-1230-4773-9d67-5801f0f3beeb/M+NK+DF+PRIMARY+STMT+SS.png");
        produit(homme, "Short Nike Unlimited Dri-FIT",
                "Short polyvalent de 18 cm sans doublure, léger et respirant, avec poches zippées.",
                64.99, 20, TAILLES_ADULTE, IMG + "a1b0c24e-3ddf-4442-ab49-5719292b7b55/M+NK+DF+UNLIMITED+WVN+7IN+UL.png");

        produit(femme, "Nike P-6000",
                "Inspirée des chaussures de running des années 2000 : mesh respirant, empiècements synthétiques et amorti en mousse.",
                119.99, 20, POINTURES_FEMME, IMG + "e25bbf6c-44fa-4853-a4e5-f545f61cd410/W+NIKE+P-6000.png");
        produit(femme, "Air Jordan 1 Low SE",
                "La Jordan 1 basse dans une édition spéciale aux matières premium. Amorti Air dans le talon.",
                129.99, 10, POINTURES_FEMME, IMG_JORDAN + "24ba5584-239d-4f4d-9536-af202af980c4/WMNS+AIR+JORDAN+1+LOW+SE.png");
        produit(femme, "Nike Vomero Plus",
                "Chaussure de running ultra-amortie pour les longues distances, avec mousse ZoomX sur toute la longueur.",
                179.99, 12, POINTURES_FEMME, IMG + "a3ceaed1-01b9-4973-be43-3ef45078ee8c/W+NIKE+VOMERO+PLUS.png");
        produit(femme, "Nike Vomero 18",
                "Running sur route confortable au quotidien : double mousse et semelle large pour une foulée stable.",
                154.99, 16, POINTURES_FEMME, IMG + "a58ded11-9b67-45a4-be0a-a9d199a210b7/W+NIKE+VOMERO+18.png");
        produit(femme, "Sweat zippé Nike Studio Fleece",
                "Sweat à capuche court et oversize, entièrement zippé, en molleton de poids moyen.",
                79.99, 18, TAILLES_ADULTE, IMG + "7266efdd-94bc-4a1d-9e79-41ba286619c8/W+NK+STDO+FLC+MW+OS+CRP+FZ+HDY.png");
        produit(femme, "Pantalon large Nike Studio Fleece",
                "Pantalon taille mi-haute à jambe large en molleton doux. Parfait avec le sweat assorti.",
                74.99, 18, TAILLES_ADULTE, IMG + "64142d22-60d1-4520-a078-29dcc704266b/W+NK+STDO+FLC+MW+STD+MR+EB+WL.png");
        produit(femme, "T-shirt oversize Jordan",
                "T-shirt ample en coton avec logo Jordan. Coupe oversize décontractée.",
                39.99, 25, TAILLES_ADULTE, IMG_JORDAN + "6d2b74bb-8895-4449-87d6-fff8e66da5f0/W+J+MARKET+OVS+TEE.png");
        produit(femme, "Brassière Nike Swift",
                "Brassière de sport à maintien élevé, légèrement doublée, pour la course et les entraînements intenses.",
                74.99, 3, "XS,S,M,L,XL", IMG + "c5341692-dc73-4ba1-b928-37db636ad722/W+NK+SWIFT+HS+BRA.png");
        produit(femme, "Legging Nike One 7/8",
                "Legging taille haute en tissu Dri-FIT doux, avec poches latérales pour ton téléphone.",
                64.99, 28, TAILLES_ADULTE, IMG + "4ffa9828-c2d7-438e-bf2c-ed87e3102327/W+NK+DF+ONE+HR+7%2F8+PKT+TGHT.png");

        produit(enfant, "Nike Air Force 1 LE Junior",
                "L'Air Force 1 en version enfant : cuir résistant, amorti Air et style intemporel pour la cour de récré.",
                89.99, 20, POINTURES_ENFANT, IMG + "d9f1d9ee-a848-4a36-aab9-48b241078ebb/AIR+FORCE+1+LE+%28GS%29.png");
        produit(enfant, "Nike Force 1 Low Petit enfant",
                "Version petit enfant avec lacets élastiques et scratch : facile à enfiler sans aide.",
                69.99, 15, "28,29,30,31,32,33", IMG + "181fa870-9308-4280-b46d-1b1aa0f757b8/FORCE+1+LOW+LACE+%28PS%29.png");
        produit(enfant, "Nike Dunk Low Junior",
                "La Dunk Low pour les plus jeunes, avec la même allure rétro que le modèle adulte.",
                89.99, 12, POINTURES_ENFANT, IMG + "e877cd9a-71cf-42d9-9674-2bbd1685f1be/NIKE+DUNK+LOW+%28GS%29.png");
        produit(enfant, "Nike Vomero 5 Junior",
                "Look running rétro et amorti généreux, pour courir, sauter et jouer toute la journée.",
                109.99, 10, POINTURES_ENFANT, IMG + "5b052441-6702-4477-ae23-c59a08ef9fdd/VOMERO+5+BG.png");
        produit(enfant, "Sweat à capuche Nike Club Fleece Junior",
                "Sweat oversize en molleton doux avec capuche doublée et poche kangourou.",
                59.99, 24, TAILLES_ENFANT, IMG + "e29d4c1e-b074-4f62-9374-c341b6ec83c1/K+NSW+CLUB+FLC+OS+HDY+CS.png");
        produit(enfant, "Pantalon Nike Club Fleece Junior",
                "Jogging en molleton avec taille élastique et bas resserrés, assorti au sweat Club Fleece.",
                54.99, 24, TAILLES_ENFANT, IMG + "46810a73-bd03-45fb-88f4-69bd8a4c237f/K+NSW+CLUB+FLC+OH+PNT+CS.png");
        produit(enfant, "Short de basket Nike Crossover",
                "Short Dri-FIT de 13 cm, léger et respirant, conçu pour les matchs de basket.",
                34.99, 30, TAILLES_ENFANT, IMG + "b672d14a-01b0-4f77-a2f6-ea3fa6010a7c/K+NK+DF+CROSSOVER+SHORT+5IN.png");
        produit(enfant, "Doudoune Nike Therma-FIT Junior",
                "Doudoune ample avec isolation Therma-FIT pour rester au chaud pendant les journées froides.",
                114.99, 8, TAILLES_ENFANT, IMG + "574b7dda-b057-4978-a713-28426fa06d89/K+NSW+ADP+TF+PUFFER+MTRL+VNR.png");
    }

    private void creerAdmin() {
        if (!utilisateurRepository.existsByEmailIgnoreCase(adminEmail)) {
            utilisateurRepository.save(new Utilisateur(
                    "Administrateur", adminEmail, passwordEncoder.encode(adminMotDePasse), Role.ADMIN));
            log.info("Compte administrateur créé : {}", adminEmail);
        }
    }

    private Categorie categorie(String nom) {
        return categorieRepository.findByNomIgnoreCase(nom)
                .orElseGet(() -> categorieRepository.save(new Categorie(nom)));
    }

    private void produit(Categorie categorie, String nom, String description, double prix,
                         int stock, String tailles, String imageUrl) {
        if (!produitRepository.existsByNomIgnoreCase(nom)) {
            produitRepository.save(new Produit(null, nom, description, prix, stock, tailles, imageUrl, categorie));
        }
    }
}
