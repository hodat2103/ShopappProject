package com.project.shopapp.controllers;

import com.github.javafaker.Faker;
import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.ProductDTO;
import com.project.shopapp.dtos.ProductImageDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.ProductImage;
import com.project.shopapp.responses.product.ProductListResponse;
import com.project.shopapp.responses.product.ProductResponse;
import com.project.shopapp.responses.product.ProductMessageResponse;
import com.project.shopapp.services.product.ProductServiceImpl;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/products")
@RequiredArgsConstructor
public class ProductController {
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    private final ProductServiceImpl productService;
    private final LocalizationUtils localizationUtils;
    @CrossOrigin(origins = "http://localhost:4200")

    @GetMapping("")
    public ResponseEntity<ProductListResponse> getProducts(
            @RequestParam(defaultValue = "", name = "keyword") String keyword,
            @RequestParam(defaultValue = "0",name = "category_id") Long categoryId,
            @RequestParam(defaultValue = "0",name = "page") int page,
            @RequestParam(defaultValue = "15",name = "limit") int limit
    ) throws Exception {
            PageRequest pageRequest = PageRequest.of(
                page, limit,
//                Sort.by("createdAt").descending());
                Sort.by("id").ascending());
//        logger.info(String.format("keyword = %s, category_id = %d, page = %d, limit = %d"),
//                                    keyword,categoryId,pageRequest,limit);
        Page<ProductResponse> productPage = productService.getAllProducts(keyword,categoryId,pageRequest);
        // get sum number of page
        int totalPages = productPage.getTotalPages();
        List<ProductResponse> products = productPage.getContent();
        return ResponseEntity.ok(ProductListResponse.builder()
                .products(products)
                .totalPages(totalPages)
                .build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Long productId) {
        try {
            Product existsProduct = productService.getProductById(productId);
            return ResponseEntity.ok(ProductResponse.fromProduct(existsProduct));
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping("")
    public ResponseEntity<?> create(
            @Valid @RequestBody ProductDTO productDTO,
            BindingResult result
    ) {
        try {
            if (result.hasErrors()) {
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);

            }
            Product newProduct = productService.create(productDTO);

            return ResponseEntity.ok(newProduct);
        } catch (Exception ex) {

            return ResponseEntity.badRequest().body(ex.getMessage());

        }


    }
    @PostMapping(value = "uploads/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImages(
            @PathVariable("id") Long productId,
            @ModelAttribute("file") List<MultipartFile> files
    ){
        try {
            Product existingProduct = productService.getProductById(productId);
            files = files == null ? new ArrayList<MultipartFile>() : files;
            if(files.size() > ProductImage.MAXIMUM_IMAGES_PER_PRODUCT){
                return ResponseEntity.badRequest().body(ProductMessageResponse.builder()
                                .message(localizationUtils.getLocalizationMessage(
                                        MessageKeys.UPLOAD_PRODUCT_IMAGE_ERROR_MAXIMUM_5))
                        .build());
            }
            List<ProductImage> productImages = new ArrayList<>();
            for (MultipartFile file : files) {
//                    if(file != null){
                if (file.getSize() == 0) {
                    continue;
                }
                if (file.getSize() > 10 * 1024 * 1024) {// kích thước >10MB
                    return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                            .body(ProductMessageResponse.builder()
                                    .message(localizationUtils.getLocalizationMessage(
                                            MessageKeys.UPLOAD_PRODUCT_IMAGE_ERROR_MAXIMUM_SIZE_10MB))
                                    .build());
                }
                String contentType = file.getContentType();

                if (contentType == null || !contentType.startsWith("image/")) {
                    return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                            .body(ProductMessageResponse.builder()
                                    .message(localizationUtils.getLocalizationMessage(
                                            MessageKeys.UPLOAD_PRODUCT_IMAGE_FILE_MUST_BE_IMAGE))
                                    .build());

                }

                String fileName = storeFile(file);
                ProductImage productImage = productService.createProductImage(
                        existingProduct.getId(),
                        ProductImageDTO.builder()
                                .imageUrl(fileName)
                                .build()
                );
//                productDTO.setThumbnail(fileName);
//                    }
                productImages.add(productImage);
            }
            return ResponseEntity.ok(productImages);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/images/{imageName}")
    public ResponseEntity<?> viewImage(@PathVariable String imageName){
        try {
            Path imagePath = Paths.get("uploads/"+imageName);
            UrlResource resource = new UrlResource(imagePath.toUri());
            if(resource.exists()){
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(resource);
            }else {
                return ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .body(new UrlResource(Paths.get("uploads/notfound.jpg").toUri()));
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }

    }
    private String storeFile(MultipartFile file) throws IOException {
        if(!isImageFile(file) || file.getOriginalFilename() == null){
            throw new IOException("Invalid image format");
        }
        String fileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));

        //get randomUUID, attach to filename
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;

        //path to folder -> save
        java.nio.file.Path uploadDir = Paths.get("uploads");


        if (!Files.exists(uploadDir)) { //check file exists
            Files.createDirectories(uploadDir);
        }

        //path
        java.nio.file.Path destination = Paths.get(uploadDir.toString(), uniqueFileName);
        //copy to folder
        Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFileName;
    }
    private boolean isImageFile(MultipartFile file){
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    @GetMapping("/by-ids")
    public  ResponseEntity<?> getProductsByIds(@RequestParam("ids") String ids){
        try {List<Long> productIds = Arrays.stream(ids.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());
            List<Product> products = productService.findProductsByIds(productIds);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody ProductDTO productDTO
    ) {
        try {
            Product updateProduct = productService.update(id,productDTO);
            return ResponseEntity.ok(updateProduct);
        } catch (DataNotFoundException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok(ProductMessageResponse.builder()
                .message(localizationUtils.getLocalizationMessage(
                        MessageKeys.DELETE_PRODUCT_SUCCESSFULLY,id))
                .build());

    }
    @DeleteMapping("/images/{id}")
    public ResponseEntity<?> deleteImage(@PathVariable Long id){
        productService.deleteProductImage(id);
        return ResponseEntity.ok("Delete product image successfully");
    }
    @PostMapping("/generateProducts")
    public ResponseEntity<String> generateProducts(){
        Faker faker = new Faker();

        for (int i = 0; i < 1_000_000; i++){
            String productName = faker.commerce().productName();
            if(productService.existByName(productName)){
                continue;
            }
            ProductDTO productDTO = ProductDTO.builder()
                    .name(productName)
                    .price(faker.number().numberBetween(10,90_000_000))
                    .description(faker.lorem().paragraph())
                    .thumbnail("")
                    .categoryId((long)faker.number().numberBetween(2,6))
                    .build();
            try {
                productService.create(productDTO);
            } catch (Exception e) {
               return ResponseEntity.badRequest().body(e.getMessage());
            }
        }
        return ResponseEntity.ok("Generate product successfully");
    }
}
